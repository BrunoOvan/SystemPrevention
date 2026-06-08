document.addEventListener("DOMContentLoaded", () => {
  const protocoloInput = document.getElementById("protocoloConsulta");
  const botaoConsultar = document.querySelector(".tracking-input button");
  const areaResultado = document.querySelector(".tracking-empty");

  if (!protocoloInput || !botaoConsultar || !areaResultado) {
    console.error("Elementos da tela acompanhar não encontrados.");
    return;
  }

  botaoConsultar.addEventListener("click", consultarProtocolo);

  protocoloInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      consultarProtocolo();
    }
  });

  async function consultarProtocolo() {
    const protocolo = protocoloInput.value.trim().toUpperCase();

    limparResultado(areaResultado);

    if (!protocolo) {
      mostrarResultado(
        areaResultado,
        "erro",
        "Informe o protocolo",
        "Digite o protocolo gerado no momento do registro da denúncia."
      );

      mostrarToast("Informe o protocolo da denúncia.", "erro");
      return;
    }

    if (!protocoloValido(protocolo)) {
      mostrarResultado(
        areaResultado,
        "erro",
        "Protocolo inválido",
        "Use um formato parecido com SP-2026-00124."
      );

      mostrarToast("Protocolo inválido.", "erro");
      return;
    }

    try {
      mostrarToast("Consultando denúncia...", "info");

      const denuncia = await buscarDenunciaPorProtocolo(protocolo);

      mostrarDenunciaEncontrada(areaResultado, denuncia);

      mostrarToast("Denúncia encontrada com sucesso.", "sucesso");
    } catch (error) {
      console.error("Erro ao consultar denúncia:", error);

      mostrarResultado(
        areaResultado,
        "erro",
        "Denúncia não encontrada",
        "Não foi possível localizar uma denúncia com este protocolo. Verifique o código informado."
      );

      mostrarToast("Denúncia não encontrada.", "erro");
    }
  }
});

function protocoloValido(protocolo) {
  return /^SP-\d{4}-\d{5}$/.test(protocolo);
}

function limparResultado(areaResultado) {
  areaResultado.classList.remove("success-state", "error-state");
}

function mostrarResultado(areaResultado, tipo, titulo, texto) {
  const icone = tipo === "erro" ? "circle-alert" : "circle-check";

  areaResultado.classList.add(
    tipo === "erro" ? "error-state" : "success-state"
  );

  areaResultado.innerHTML = `
    <i data-lucide="${icone}"></i>
    <h3>${titulo}</h3>
    <p>${texto}</p>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}

function mostrarDenunciaEncontrada(areaResultado, denuncia) {
  areaResultado.classList.remove("error-state");
  areaResultado.classList.add("success-state", "tracking-result");

  areaResultado.innerHTML = `
    <div class="tracking-result-header">
      <div>
        <i data-lucide="file-check-2"></i>
      </div>

      <div>
        <h3>Denúncia encontrada</h3>
        <p>Protocolo ${denuncia.protocolo}</p>
      </div>
    </div>

    <div class="tracking-result-grid">
      <div>
        <span>Status</span>
        <strong>${formatarTexto(denuncia.status)}</strong>
      </div>

      <div>
        <span>Tipo de golpe</span>
        <strong>${formatarTexto(denuncia.tipoGolpe)}</strong>
      </div>

      <div>
        <span>Canal</span>
        <strong>${formatarTexto(denuncia.canal)}</strong>
      </div>

      <div>
        <span>Nível de risco</span>
        <strong>${formatarTexto(denuncia.nivelRisco)}</strong>
      </div>
    </div>

    <div class="tracking-result-section">
      <span>Relato registrado</span>
      <p>${escaparHtml(denuncia.relato)}</p>
    </div>

    <div class="tracking-result-section">
      <span>Recomendação preventiva</span>
      <p>${escaparHtml(denuncia.recomendacao || "Nenhuma recomendação disponível.")}</p>
    </div>

    <div class="tracking-result-footer">
      <small>Registrado em: ${formatarData(denuncia.criadoEm)}</small>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}

function formatarTexto(valor) {
  if (!valor) return "Não informado";

  return valor
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, letra => letra.toUpperCase());
}

function formatarData(data) {
  if (!data) return "Data não informada";

  return new Date(data).toLocaleString("pt-BR");
}

function escaparHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}