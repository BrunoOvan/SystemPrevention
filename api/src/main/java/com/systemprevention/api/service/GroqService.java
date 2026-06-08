package com.systemprevention.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.systemprevention.api.dto.DeltaChatRequest;
import com.systemprevention.api.dto.DeltaChatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GroqService {

    @Value("${systemprevention.groq.api.key}")
    private String groqApiKey;

    @Value("${groq.api.url}")
    private String groqApiUrl;

    @Value("${groq.model}")
    private String groqModel;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public DeltaChatResponse conversarComDelta(DeltaChatRequest request) {
        try {
            String chaveLimpa = groqApiKey.trim();

            

            String promptSistema = montarPromptSistema();
            String mensagemUsuario = montarMensagemUsuario(request);

            Map<String, Object> body = Map.of(
                    "model", groqModel,
                    "temperature", 0.3,
                    "max_tokens", 180,
                    "messages", List.of(
                            Map.of(
                                    "role", "system",
                                    "content", promptSistema
                            ),
                            Map.of(
                                    "role", "user",
                                    "content", mensagemUsuario
                            )
                    )
            );

            String jsonBody = objectMapper.writeValueAsString(body);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(groqApiUrl.trim()))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + chaveLimpa)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpClient client = HttpClient.newHttpClient();

            HttpResponse<String> response = client.send(
                    httpRequest,
                    HttpResponse.BodyHandlers.ofString()
            );

           

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new RuntimeException("Erro ao consultar Groq: " + response.body());
            }

            JsonNode root = objectMapper.readTree(response.body());

            String resposta = root
                    .path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();

            return new DeltaChatResponse(resposta.trim());

        } catch (Exception e) {
            throw new RuntimeException("Não foi possível consultar a DELTA no momento: " + e.getMessage());
        }
    }

    

    private String montarPromptSistema() {
    return """
            Você é a DELTA, assistente virtual do sistema SystemPrevention.

            Seu papel é conduzir, de forma profissional, o registro de uma tentativa de golpe financeiro ou bancário.

            Regras obrigatórias:
            - Responda sempre em português do Brasil.
            - Seja natural, profissional e objetivo.
            - Faça apenas uma pergunta por vez.
            - Não invente informações.
            - Não use frases estranhas como "eles pediram algo de você" quando o canal for SMS ou e-mail.
            - Em mensagens por SMS, WhatsApp ou e-mail, pergunte se havia link, boleto, Pix, cobrança, anexo, site falso ou pedido para acessar alguma página.
            - Em ligação, pergunte se solicitaram senha, código, token, dados do cartão, Pix ou confirmação de dados.
            - Não peça senha, token, código de autenticação, número completo do cartão ou dados sensíveis.
            - Se o usuário mencionar dado sensível, oriente a não compartilhar esse tipo de informação.
            - Não gere protocolo.
            - Não diga que a denúncia foi salva antes da confirmação final.
            - Não informe classificação final, tipo de golpe ou nível de risco no chat de relato.
            - Não fale como se tivesse certeza absoluta que é golpe; use termos como "contato suspeito", "possível tentativa" ou "indício".
            - As respostas devem ser curtas e adequadas para um chat.

            Fluxo ideal:
            1. Identificar o canal do contato.
            2. Pedir a descrição do ocorrido.
            3. Perguntar se houve link, cobrança, boleto, Pix, anexo, pedido de dados, senha, código ou token.
            4. Pedir confirmação para registrar a denúncia.
            """;
}

    private String montarMensagemUsuario(DeltaChatRequest request) {
        return """
                Etapa atual do fluxo: %s

                Contexto já coletado:
                %s

                Mensagem do usuário:
                %s
                """.formatted(
                request.etapa() == null ? "não informada" : request.etapa(),
                request.contexto() == null || request.contexto().isBlank() ? "nenhum contexto informado" : request.contexto(),
                request.mensagem()
        );
    }
}