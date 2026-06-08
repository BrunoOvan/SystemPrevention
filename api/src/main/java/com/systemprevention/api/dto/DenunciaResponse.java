package com.systemprevention.api.dto;

import com.systemprevention.api.model.CanalContato;
import com.systemprevention.api.model.NivelRisco;
import com.systemprevention.api.model.StatusDenuncia;
import com.systemprevention.api.model.TipoGolpe;

import java.time.LocalDateTime;

public record DenunciaResponse(
        Long id,
        String protocolo,
        String relato,
        CanalContato canal,
        TipoGolpe tipoGolpe,
        NivelRisco nivelRisco,
        StatusDenuncia status,
        String recomendacao,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {
}
