package com.systemprevention.api.dto;

public record DashboardResumoResponse(
        long totalDenuncias,
        long casosAnalisados,
        long riscoAlto,
        String golpeMaisRelatado
) {
}
