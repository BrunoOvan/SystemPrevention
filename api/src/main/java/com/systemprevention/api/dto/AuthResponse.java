package com.systemprevention.api.dto;

public record AuthResponse(
        String token,
        String nome,
        String email
) {
}
