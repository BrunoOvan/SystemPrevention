package com.systemprevention.api.dto;

import com.systemprevention.api.model.CanalContato;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DenunciaRequest(

        @NotBlank(message = "O relato é obrigatório.")
        @Size(min = 10, message = "O relato deve ter pelo menos 10 caracteres.")
        String relato,

        @NotNull(message = "O canal de contato é obrigatório.")
        CanalContato canal
) {
}
