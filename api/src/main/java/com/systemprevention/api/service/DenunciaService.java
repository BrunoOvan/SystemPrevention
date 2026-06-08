package com.systemprevention.api.service;

import com.systemprevention.api.dto.DenunciaRequest;
import com.systemprevention.api.dto.DenunciaResponse;
import com.systemprevention.api.model.*;
import com.systemprevention.api.repository.DenunciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DenunciaService {

    private final DenunciaRepository denunciaRepository;
    public DenunciaResponse registrarComStatus(
        DenunciaRequest request,
        Usuario usuario,
        StatusDenuncia status
) {
    if (usuario == null) {
        throw new RuntimeException("Usuário autenticado não encontrado.");
    }

    TipoGolpe tipoGolpe = identificarTipoGolpe(request.relato());
    NivelRisco nivelRisco = identificarNivelRisco(request.relato());
    String recomendacao = gerarRecomendacao(tipoGolpe, nivelRisco);

    Denuncia denuncia = Denuncia.builder()
            .protocolo(gerarProtocolo())
            .relato(request.relato())
            .canal(request.canal())
            .tipoGolpe(tipoGolpe)
            .nivelRisco(nivelRisco)
            .status(status)
            .recomendacao(recomendacao)
            .criadoEm(LocalDateTime.now())
            .atualizadoEm(LocalDateTime.now())
            .usuario(usuario)
            .build();

    denunciaRepository.save(denuncia);

    return toResponse(denuncia);
}    
    public DenunciaResponse registrar(DenunciaRequest request, Usuario usuario) {
        if (usuario == null) {
            throw new RuntimeException("Usuário autenticado não encontrado.");
        }

        TipoGolpe tipoGolpe = identificarTipoGolpe(request.relato());
        NivelRisco nivelRisco = identificarNivelRisco(request.relato());
        String recomendacao = gerarRecomendacao(tipoGolpe, nivelRisco);

        Denuncia denuncia = Denuncia.builder()
                .protocolo(gerarProtocolo())
                .relato(request.relato())
                .canal(request.canal())
                .tipoGolpe(tipoGolpe)
                .nivelRisco(nivelRisco)
                .status(StatusDenuncia.CONCLUIDO)
                .recomendacao(recomendacao)
                .criadoEm(LocalDateTime.now())
                .atualizadoEm(LocalDateTime.now())
                .usuario(usuario)
                .build();

        denunciaRepository.save(denuncia);

        return toResponse(denuncia);
    }

    public DenunciaResponse buscarPorProtocolo(String protocolo) {
        Denuncia denuncia = denunciaRepository.findByProtocolo(protocolo)
                .orElseThrow(() -> new RuntimeException("Denúncia não encontrada."));

        return toResponse(denuncia);
    }

    public List<DenunciaResponse> listarTodas() {
        return denunciaRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<DenunciaResponse> listarPorUsuario(Usuario usuario) {
        if (usuario == null) {
            throw new RuntimeException("Usuário autenticado não encontrado.");
        }

        return denunciaRepository.findByUsuarioId(usuario.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private DenunciaResponse toResponse(Denuncia denuncia) {
        return new DenunciaResponse(
                denuncia.getId(),
                denuncia.getProtocolo(),
                denuncia.getRelato(),
                denuncia.getCanal(),
                denuncia.getTipoGolpe(),
                denuncia.getNivelRisco(),
                denuncia.getStatus(),
                denuncia.getRecomendacao(),
                denuncia.getCriadoEm(),
                denuncia.getAtualizadoEm()
        );
    }

    private String gerarProtocolo() {
        String protocolo;

        do {
            int ano = LocalDateTime.now().getYear();
            int numero = new SecureRandom().nextInt(90000) + 10000;
            protocolo = "SP-" + ano + "-" + numero;
        } while (denunciaRepository.existsByProtocolo(protocolo));

        return protocolo;
    }

    private TipoGolpe identificarTipoGolpe(String relato) {
        String texto = relato.toLowerCase();

        if (
                texto.contains("central") ||
                texto.contains("atendente") ||
                texto.contains("funcionário do banco") ||
                texto.contains("funcionario do banco") ||
                texto.contains("central de segurança") ||
                texto.contains("central de seguranca")
        ) {
            return TipoGolpe.FALSA_CENTRAL_ATENDIMENTO;
        }

        if (
                texto.contains("compra suspeita") ||
                texto.contains("acesso suspeito") ||
                texto.contains("tentativa de acesso") ||
                texto.contains("alerta de segurança") ||
                texto.contains("alerta de seguranca")
        ) {
            return TipoGolpe.FALSO_ALERTA_SEGURANCA;
        }

        if (
                texto.contains("conta bloqueada") ||
                texto.contains("bloqueio da conta") ||
                texto.contains("cartão bloqueado") ||
                texto.contains("cartao bloqueado") ||
                texto.contains("app bloqueado")
        ) {
            return TipoGolpe.FALSO_BLOQUEIO_CONTA;
        }

        if (
                texto.contains("regularizar conta") ||
                texto.contains("regularização") ||
                texto.contains("regularizacao") ||
                texto.contains("validar cadastro") ||
                texto.contains("confirmar cadastro")
        ) {
            return TipoGolpe.FALSA_REGULARIZACAO_CONTA;
        }

        if (
                texto.contains("site falso") ||
                texto.contains("página falsa") ||
                texto.contains("pagina falsa") ||
                texto.contains("internet banking falso")
        ) {
            return TipoGolpe.SITE_FALSO_BANCO;
        }

        if (
                texto.contains("sms") ||
                texto.contains("mensagem de texto") ||
                texto.contains("0800")
        ) {
            return TipoGolpe.SMISHING_SMS_FALSO;
        }

        if (
                texto.contains("whatsapp") ||
                texto.contains("zap")
        ) {
            return TipoGolpe.GOLPE_WHATSAPP;
        }

        if (
                texto.contains("link") ||
                texto.contains("e-mail") ||
                texto.contains("email") ||
                texto.contains("phishing")
        ) {
            return TipoGolpe.PHISHING_LINK_FALSO;
        }

        if (
                texto.contains("comprovante falso") ||
                texto.contains("print do pix") ||
                texto.contains("pix comprovante") ||
                texto.contains("pagamento falso")
        ) {
            return TipoGolpe.FALSO_COMPROVANTE_PIX;
        }

        if (
                texto.contains("pix errado") ||
                texto.contains("devolver pix") ||
                texto.contains("devolução do pix") ||
                texto.contains("devolucao do pix")
        ) {
            return TipoGolpe.FALSA_DEVOLUCAO_PIX;
        }

        if (
                texto.contains("pix") ||
                texto.contains("chave pix") ||
                texto.contains("qr code")
        ) {
            return TipoGolpe.GOLPE_PIX;
        }

        if (
                texto.contains("boleto") ||
                texto.contains("código de barras") ||
                texto.contains("codigo de barras")
        ) {
            return TipoGolpe.FALSO_BOLETO;
        }

        if (
                texto.contains("renegociação") ||
                texto.contains("renegociacao") ||
                texto.contains("acordo de dívida") ||
                texto.contains("acordo de divida") ||
                texto.contains("quitação") ||
                texto.contains("quitacao")
        ) {
            return TipoGolpe.FALSA_RENEGOCIACAO_DIVIDA;
        }

        if (
                texto.contains("cobrança") ||
                texto.contains("cobranca") ||
                texto.contains("tarifa") ||
                texto.contains("débito pendente") ||
                texto.contains("debito pendente")
        ) {
            return TipoGolpe.FALSA_COBRANCA_BANCARIA;
        }

        if (
                texto.contains("compra não reconhecida") ||
                texto.contains("compra nao reconhecida") ||
                texto.contains("compra suspeita") ||
                texto.contains("transação no cartão") ||
                texto.contains("transacao no cartao")
        ) {
            return TipoGolpe.COMPRA_NAO_RECONHECIDA;
        }

        if (
                texto.contains("cartão clonado") ||
                texto.contains("cartao clonado") ||
                texto.contains("clonaram meu cartão") ||
                texto.contains("clonaram meu cartao")
        ) {
            return TipoGolpe.CARTAO_CLONADO;
        }

        if (
                texto.contains("usaram meu cartão") ||
                texto.contains("usaram meu cartao") ||
                texto.contains("uso indevido do cartão") ||
                texto.contains("uso indevido do cartao")
        ) {
            return TipoGolpe.USO_INDEVIDO_CARTAO;
        }

        if (
                texto.contains("troca de cartão") ||
                texto.contains("troca de cartao") ||
                texto.contains("cartão retido") ||
                texto.contains("cartao retido") ||
                texto.contains("maquininha")
        ) {
            return TipoGolpe.TROCA_OU_RETENCAO_CARTAO;
        }

        if (
                texto.contains("atualizar cadastro") ||
                texto.contains("atualização cadastral") ||
                texto.contains("atualizacao cadastral") ||
                texto.contains("biometria") ||
                texto.contains("validar dispositivo")
        ) {
            return TipoGolpe.FALSA_ATUALIZACAO_CADASTRAL;
        }

        if (
                texto.contains("token") ||
                texto.contains("código") ||
                texto.contains("codigo") ||
                texto.contains("chave de segurança") ||
                texto.contains("chave de seguranca")
        ) {
            return TipoGolpe.FALSO_TOKEN_OU_CODIGO;
        }

        if (
                texto.contains("suporte técnico") ||
                texto.contains("suporte tecnico") ||
                texto.contains("acesso remoto") ||
                texto.contains("anydesk") ||
                texto.contains("teamviewer")
        ) {
            return TipoGolpe.FALSO_SUPORTE_TECNICO;
        }

        if (
                texto.contains("instalar aplicativo") ||
                texto.contains("instale um app") ||
                texto.contains("apk") ||
                texto.contains("aplicativo fora da loja") ||
                texto.contains("app malicioso")
        ) {
            return TipoGolpe.INSTALACAO_APP_MALICIOSO;
        }

        if (
                texto.contains("empréstimo") ||
                texto.contains("emprestimo") ||
                texto.contains("crédito aprovado") ||
                texto.contains("credito aprovado") ||
                texto.contains("taxa antecipada")
        ) {
            return TipoGolpe.FALSO_EMPRESTIMO;
        }

        if (
                texto.contains("celular roubado") ||
                texto.contains("roubo de celular") ||
                texto.contains("celular furtado") ||
                texto.contains("perdi meu celular")
        ) {
            return TipoGolpe.ROUBO_CELULAR_ACESSO_CONTA;
        }

        if (
                texto.contains("senha") ||
                texto.contains("dados bancários") ||
                texto.contains("dados bancarios") ||
                texto.contains("dados da conta")
        ) {
            return TipoGolpe.ENGENHARIA_SOCIAL;
        }

        return TipoGolpe.OUTRO;
    }

    private NivelRisco identificarNivelRisco(String relato) {
        String texto = relato.toLowerCase();

        if (
                texto.contains("senha") ||
                texto.contains("token") ||
                texto.contains("código") ||
                texto.contains("codigo") ||
                texto.contains("pix") ||
                texto.contains("transferência") ||
                texto.contains("transferencia") ||
                texto.contains("dados bancários") ||
                texto.contains("dados bancarios") ||
                texto.contains("acesso remoto") ||
                texto.contains("apk")
        ) {
            return NivelRisco.ALTO;
        }

        if (
                texto.contains("link") ||
                texto.contains("boleto") ||
                texto.contains("bloqueio") ||
                texto.contains("bloqueada") ||
                texto.contains("cartão") ||
                texto.contains("cartao") ||
                texto.contains("cadastro")
        ) {
            return NivelRisco.MEDIO;
        }

        return NivelRisco.BAIXO;
    }

    private String gerarRecomendacao(TipoGolpe tipoGolpe, NivelRisco nivelRisco) {
        if (nivelRisco == NivelRisco.ALTO || nivelRisco == NivelRisco.CRITICO) {
            return "Não informe senhas, códigos, tokens ou dados bancários. Não realize pagamentos ou transferências. Procure a instituição apenas pelos canais oficiais.";
        }

        return switch (tipoGolpe) {
            case FALSA_CENTRAL_ATENDIMENTO ->
                    "Desconfie de ligações dizendo ser da central do banco. Encerre o contato e procure os canais oficiais da instituição.";

            case FALSO_ALERTA_SEGURANCA, FALSO_BLOQUEIO_CONTA ->
                    "Não clique em links nem informe dados após alertas recebidos por mensagem ou ligação. Acesse o aplicativo oficial ou canais oficiais.";

            case FALSA_REGULARIZACAO_CONTA, FALSA_ATUALIZACAO_CADASTRAL ->
                    "Nunca atualize ou regularize cadastro por links recebidos. Use apenas aplicativo, internet banking oficial ou atendimento oficial.";

            case PHISHING_LINK_FALSO, SITE_FALSO_BANCO ->
                    "Não acesse links suspeitos. Digite o endereço oficial no navegador ou use o aplicativo oficial da instituição.";

            case SMISHING_SMS_FALSO ->
                    "Não clique em links recebidos por SMS e não ligue para números informados na mensagem. Use apenas canais oficiais.";

            case GOLPE_WHATSAPP ->
                    "Confirme a identidade do contato por outro canal antes de enviar dinheiro, códigos ou informações pessoais.";

            case GOLPE_PIX, FALSO_COMPROVANTE_PIX, FALSA_DEVOLUCAO_PIX ->
                    "Antes de realizar ou devolver um Pix, confirme a origem da solicitação, confira o extrato e valide os dados do recebedor.";

            case FALSO_BOLETO, FALSA_RENEGOCIACAO_DIVIDA, FALSA_COBRANCA_BANCARIA ->
                    "Antes de pagar, confira beneficiário, valor, banco emissor e código de barras. Negocie apenas por canais oficiais.";

            case COMPRA_NAO_RECONHECIDA, CARTAO_CLONADO, USO_INDEVIDO_CARTAO, TROCA_OU_RETENCAO_CARTAO ->
                    "Em caso de suspeita envolvendo cartão, bloqueie o cartão pelos canais oficiais e acompanhe as transações pelo aplicativo.";

            case FALSO_TOKEN_OU_CODIGO ->
                    "Nunca informe códigos de autenticação, token, senha ou chave de segurança a terceiros.";

            case FALSO_SUPORTE_TECNICO, INSTALACAO_APP_MALICIOSO ->
                    "Não instale aplicativos indicados por terceiros e não permita acesso remoto ao seu celular ou computador.";

            case FALSO_EMPRESTIMO ->
                    "Desconfie de ofertas de crédito que exigem taxa antecipada. Contrate crédito somente pelos canais oficiais.";

            case ROUBO_CELULAR_ACESSO_CONTA ->
                    "Em caso de roubo ou furto do celular, bloqueie o aparelho, o chip e acesse os canais oficiais para proteger sua conta.";

            case ENGENHARIA_SOCIAL ->
                    "Desconfie de abordagens com urgência, pressão emocional ou pedido de dados sigilosos.";

            case OUTRO ->
                    "Mantenha atenção, não compartilhe dados sensíveis e confirme a origem do contato por canais oficiais.";
        };
    }
}