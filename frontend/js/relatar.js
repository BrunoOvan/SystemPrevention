document.addEventListener("DOMContentLoaded", () => {
  const chatMessages = document.querySelector(".chat-messages");
  const input = document.getElementById("deltaInput");
  const button = document.getElementById("deltaSendButton");

  if (!chatMessages || !input || !button) {
    console.error("Elementos do chat DELTA não encontrados.");
    return;
  }

  let etapa = 1;

  const denuncia = {
    canal: "",
    relato: "",
    detalhesSensiveis: ""
  };

  button.addEventListener("click", (event) => {
    event.preventDefault();
    enviarMensagem();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      enviarMensagem();
    }
  });

  async function enviarMensagem() {
    const mensagem = input.value.trim();

    if (!mensagem) {
      mostrarToast("Digite uma resposta antes de enviar.", "erro");
      return;
    }

    adicionarMensagemUsuario(mensagem);
    input.value = "";

    bloquearEntrada(true);
    mostrarDigitando();

    setTimeout(async () => {
      try {
        await processarEtapa(mensagem);
      } catch (error) {
        console.error("Erro no fluxo da DELTA:", error);
        removerDigitando();

        adicionarMensagemDelta(
          "Ocorreu um erro ao processar sua mensagem. Tente novamente."
        );

        mostrarToast("Erro ao processar mensagem.", "erro");
      }

      bloquearEntrada(false);
      input.focus();
    }, gerarTempoProcessamento());
  }

  async function processarEtapa(mensagem) {
    if (etapa === 1) {
      const canalIdentificado = identificarCanal(mensagem);

      if (!canalIdentificado) {
        await responderComDeltaIA(
          mensagem,
          "O usuário ainda não informou corretamente o canal do contato suspeito. Oriente a informar WhatsApp, ligação, SMS, e-mail ou outro."
        );
        return;
      }

      denuncia.canal = canalIdentificado;
      etapa = 2;

      await responderComDeltaIA(
        mensagem,
        `Canal identificado: ${formatarCanalParaTexto(denuncia.canal)}. Agora peça para o usuário descrever o que aconteceu, sem enviar senhas, códigos, tokens ou dados sensíveis.`
      );

      return;
    }

    if (etapa === 2) {
      if (mensagem.length < 15) {
        await responderComDeltaIA(
          mensagem,
          "O relato está muito curto. Peça para o usuário explicar melhor o que aconteceu, de forma objetiva."
        );
        return;
      }

      denuncia.relato = mensagem;
      etapa = 3;

     await responderComDeltaIA(
  mensagem,
  `O usuário descreveu o ocorrido pelo canal ${formatarCanalParaTexto(denuncia.canal)}.
  Agora faça uma pergunta adequada ao canal.
  Se for SMS, WhatsApp ou e-mail, pergunte se havia link, boleto, cobrança, Pix, anexo, site falso ou orientação para acessar alguma página.
  Se for ligação, pergunte se solicitaram senha, código, token, dados bancários, Pix ou confirmação de dados.
  Não use a frase "pediram algo de você" de forma genérica.`
);

      return;
    }

    if (etapa === 3) {
      denuncia.detalhesSensiveis = mensagem;
      etapa = 4;

      await responderComDeltaIA(
        mensagem,
        "O usuário informou se houve pedido suspeito. Agora peça confirmação para registrar a denúncia e gerar protocolo. Informe que ele deve responder sim para confirmar ou não para cancelar."
      );

      return;
    }

    if (etapa === 4) {
      const resposta = normalizarTexto(mensagem);

      if (
        resposta !== "sim" &&
        resposta !== "s" &&
        resposta !== "confirmo" &&
        resposta !== "confirmar"
      ) {
        removerDigitando();

        adicionarMensagemDelta(
          "Registro cancelado. Nenhuma denúncia foi enviada. Caso queira começar novamente, atualize a página."
        );

        input.disabled = true;
        button.disabled = true;
        return;
      }

      await registrarDenunciaNoBackend();
    }
  }

  async function responderComDeltaIA(mensagemUsuario, contextoExtra) {
    try {
      const contexto = montarContextoParaIA(contextoExtra);

      const resposta = await apiRequest("/ia/delta", {
        method: "POST",
        body: JSON.stringify({
          mensagem: mensagemUsuario,
          etapa,
          contexto
        })
      });

      removerDigitando();

      if (resposta && resposta.resposta) {
        adicionarMensagemDelta(resposta.resposta);
      } else {
        adicionarMensagemDelta(obterRespostaFallback());
      }
    } catch (error) {
      console.error("Erro ao consultar DELTA IA:", error);

      removerDigitando();
      adicionarMensagemDelta(obterRespostaFallback());
    }
  }

  async function registrarDenunciaNoBackend() {
    try {
      const relatoCompleto = montarRelatoCompleto();

      const resposta = await registrarDenuncia({
        relato: relatoCompleto,
        canal: denuncia.canal
      });

      removerDigitando();

      adicionarMensagemDelta(
        `Denúncia registrada com sucesso. Seu protocolo de acompanhamento é: ${resposta.protocolo}. Guarde esse código para consultar manualmente na página Acompanhar Denúncia.`
      );

      mostrarToast("Denúncia registrada com sucesso.", "sucesso");

      input.disabled = true;
      button.disabled = true;
      input.placeholder = "Denúncia registrada. Consulte pelo protocolo.";
    } catch (error) {
      removerDigitando();

      console.error("Erro ao registrar denúncia:", error);

      adicionarMensagemDelta(
        "Não foi possível registrar a denúncia no momento. Verifique se você está logado e se o backend está rodando."
      );

      mostrarToast("Erro ao registrar denúncia.", "erro");
    }
  }

  function montarContextoParaIA(contextoExtra) {
    return `
Fluxo atual do relato:
- Etapa atual: ${etapa}
- Canal já identificado: ${denuncia.canal ? formatarCanalParaTexto(denuncia.canal) : "ainda não informado"}
- Relato já coletado: ${denuncia.relato || "ainda não informado"}
- Informações adicionais: ${denuncia.detalhesSensiveis || "ainda não informado"}

Instrução para esta resposta:
${contextoExtra}

Regras:
- Responda como DELTA.
- Faça apenas uma pergunta por vez.
- Não gere protocolo.
- Não diga que a denúncia foi salva antes da confirmação final.
- Não informe tipo de golpe, nível de risco ou análise final neste chat.
- Não peça senha, token, código, número completo do cartão ou dados sensíveis.
    `.trim();
  }

  function obterRespostaFallback() {
    if (etapa === 1) {
      return "Para continuar, informe por qual canal você recebeu o contato suspeito: WhatsApp, ligação, SMS, e-mail ou outro.";
    }

    if (etapa === 2) {
      return "Entendi. Agora descreva o que aconteceu. Informe o que a pessoa ou mensagem dizia, mas não envie senhas, códigos, tokens ou dados sensíveis.";
    }

    if (etapa === 3) {
      return "Durante esse contato, pediram senha, código de autenticação, token, Pix, boleto, dados do cartão ou dados bancários? Responda resumidamente.";
    }

    if (etapa === 4) {
      return "Certo. Confirma que deseja registrar essa denúncia e gerar um protocolo de acompanhamento? Responda sim para confirmar ou não para cancelar.";
    }

    return "Certo. Pode continuar.";
  }

  function montarRelatoCompleto() {
    return `
Canal informado pelo usuário: ${formatarCanalParaTexto(denuncia.canal)}.
Relato do usuário: ${denuncia.relato}
Informações adicionais sobre pedidos suspeitos: ${denuncia.detalhesSensiveis}
    `.trim();
  }

  function identificarCanal(texto) {
    const valor = normalizarTexto(texto);

    if (valor.includes("whatsapp") || valor.includes("zap")) {
      return "WHATSAPP";
    }

    if (
      valor.includes("ligacao") ||
      valor.includes("telefone") ||
      valor.includes("chamada") ||
      valor.includes("ligaram")
    ) {
      return "LIGACAO";
    }

    if (valor.includes("sms") || valor.includes("mensagem de texto")) {
      return "SMS";
    }

    if (
      valor.includes("email") ||
      valor.includes("e-mail") ||
      valor.includes("correio eletronico")
    ) {
      return "EMAIL";
    }

    if (valor.includes("outro") || valor.includes("outros")) {
      return "OUTRO";
    }

    return null;
  }

  function adicionarMensagemUsuario(texto) {
    const div = document.createElement("div");
    div.className = "message user-message";

    div.innerHTML = `
      <div class="message-content">
        <p>${escaparHtml(texto)}</p>
      </div>
    `;

    chatMessages.appendChild(div);
    rolarChatParaBaixo();
  }

  function adicionarMensagemDelta(texto) {
    const div = document.createElement("div");
    div.className = "message delta-message";

    div.innerHTML = `
      <div class="message-avatar">
        <i data-lucide="bot"></i>
      </div>

      <div class="message-content">
        <span>DELTA</span>
        <p>${escaparHtml(texto)}</p>
      </div>
    `;

    chatMessages.appendChild(div);

    if (window.lucide) {
      lucide.createIcons();
    }

    rolarChatParaBaixo();
  }

  function mostrarDigitando() {
    if (document.getElementById("deltaTyping")) return;

    const div = document.createElement("div");
    div.className = "message delta-message typing-message";
    div.id = "deltaTyping";

    div.innerHTML = `
      <div class="message-avatar">
        <i data-lucide="bot"></i>
      </div>

      <div class="message-content">
        <span>DELTA</span>
        <p class="typing-dots">
          <strong></strong>
          <strong></strong>
          <strong></strong>
        </p>
      </div>
    `;

    chatMessages.appendChild(div);

    if (window.lucide) {
      lucide.createIcons();
    }

    rolarChatParaBaixo();
  }

  function removerDigitando() {
    const typing = document.getElementById("deltaTyping");

    if (typing) {
      typing.remove();
    }
  }

  function bloquearEntrada(bloquear) {
    input.disabled = bloquear;
    button.disabled = bloquear;
  }

  function gerarTempoProcessamento() {
    return Math.floor(Math.random() * 900) + 900;
  }

  function rolarChatParaBaixo() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function escaparHtml(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
  }

  function normalizarTexto(texto) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function formatarCanalParaTexto(canal) {
    const canais = {
      WHATSAPP: "WhatsApp",
      LIGACAO: "Ligação",
      SMS: "SMS",
      EMAIL: "E-mail",
      OUTRO: "Outros"
    };

    return canais[canal] || canal;
  }
});