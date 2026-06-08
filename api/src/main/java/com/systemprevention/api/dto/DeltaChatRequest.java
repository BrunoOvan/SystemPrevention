package com.systemprevention.api.dto;



import jakarta.validation.constraints.NotBlank;

public record DeltaChatRequest(

        @NotBlank(message = "A mensagem é obrigatória.")
        String mensagem,

        Integer etapa,

        String contexto
) {
}
