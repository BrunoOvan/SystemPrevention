package com.systemprevention.api.config;

import com.systemprevention.api.model.StatusDenuncia;

import com.systemprevention.api.dto.DenunciaRequest;
import com.systemprevention.api.model.CanalContato;
import com.systemprevention.api.model.Usuario;
import com.systemprevention.api.repository.DenunciaRepository;
import com.systemprevention.api.repository.UsuarioRepository;
import com.systemprevention.api.service.DenunciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Profile("dev")
public class DataLoader implements CommandLineRunner {

    private final DenunciaRepository denunciaRepository;
    private final UsuarioRepository usuarioRepository;
    private final DenunciaService denunciaService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (denunciaRepository.count() > 0) {
            return;
        }

        Usuario usuarioDemo = buscarOuCriarUsuarioDemo();

        denunciaService.registrarComStatus(new DenunciaRequest(
                        "Recebi uma ligação de uma falsa central dizendo que havia uma compra suspeita no meu cartão e pediram meu CPF.",
                        CanalContato.LIGACAO), usuarioDemo, StatusDenuncia.CONCLUIDO);

        denunciaService.registrar(new DenunciaRequest(
                "Uma chamada recebi do banco mas ao atender, não se escuta nada.",
                CanalContato.LIGACAO
        ), usuarioDemo);

        denunciaService.registrar(new DenunciaRequest(
                "Recebi um SMS falso dizendo que minha conta bloqueada precisava de regularização através do link que leva ao site supostamente falso.",
                CanalContato.SMS
        ), usuarioDemo);

        denunciaService.registrar(new DenunciaRequest(
                "Recebi mensagem de texto SMS com alerta de segurança em uma compra aprovada e me enviaram um link para verificar.",
                CanalContato.SMS
        ), usuarioDemo);

        denunciaService.registrar(new DenunciaRequest(
                "Recebi um e-mail com link falso de phishing informando o pagamento da fatura em atraso com anexo PDF idêntico ao original.",
                CanalContato.EMAIL
        ), usuarioDemo);

        denunciaService.registrar(new DenunciaRequest(
                "Acessei uma página falsa parecida com internet banking falso pedindo senha e dados da conta.",
                CanalContato.EMAIL
        ), usuarioDemo);

        denunciaService.registrar(new DenunciaRequest(
                "Um contato verificado que é de um banco no WhatsApp mandou mensagem de uma fatura paga com débito automático no valor de R$ 6000,00 em meu nome e pediu meu CPF.",
                CanalContato.WHATSAPP
        ), usuarioDemo);

        denunciaService.registrar(new DenunciaRequest(
                "Me chegou uma mensagem de confirmação da compra de um produto no valor de R$3000,00 em meu nome com número do cartão final 8721.",
                CanalContato.WHATSAPP
        ), usuarioDemo);

        denunciaService.registrar(new DenunciaRequest(
                "Recebi um boleto de cobrança bancária com código de barras suspeito e beneficiário desconhecido.",
                CanalContato.EMAIL
        ), usuarioDemo);

        denunciaService.registrar(new DenunciaRequest(
                "Recebi uma falsa cobrança bancária por tarifa pendente e pediram pagamento por boleto.",
                CanalContato.SMS
        ), usuarioDemo);

        denunciaService.registrar(new DenunciaRequest(
                "Apareceu uma compra não reconhecida no cartão e recebi uma ligação pedindo confirmação de dados.",
                CanalContato.LIGACAO
        ), usuarioDemo);

        denunciaService.registrar(new DenunciaRequest(
                "Informaram que meu cartão clonado estava sendo usado e pediram para confirmar senha e código.",
                CanalContato.LIGACAO
        ), usuarioDemo);

        denunciaService.registrar(new DenunciaRequest(
                "Recebi mensagem pedindo token e código de autenticação para desbloquear minha conta.",
                CanalContato.SMS
        ), usuarioDemo);

        denunciaService.registrar(new DenunciaRequest(
                "Um suposto suporte técnico pediu para instalar aplicativo de acesso remoto para resolver problema no app do banco.",
                CanalContato.LIGACAO
        ), usuarioDemo);

        denunciaService.registrar(new DenunciaRequest(
                "Meu celular foi roubado e fiquei preocupado com o acesso ao aplicativo do banco e possíveis transações.",
                CanalContato.WHATSAPP
        ), usuarioDemo);

        denunciaService.registrar(new DenunciaRequest(
                "Meu celular foi roubado e fiquei preocupado com o acesso ao aplicativo do banco e possíveis transações na conta.",
                CanalContato.OUTRO
        ), usuarioDemo);
    }

    private Usuario buscarOuCriarUsuarioDemo() {
        return usuarioRepository.findAll()
                .stream()
                .findFirst()
                .orElseGet(() -> {
                    Usuario usuario = Usuario.builder()
                            .nome("Usuário Demonstração")
                            .email("demo@systemprevention.com")
                            .senha(passwordEncoder.encode("123456"))
                            .criadoEm(LocalDateTime.now())
                            .build();

                    return usuarioRepository.save(usuario);
                });
    }
}