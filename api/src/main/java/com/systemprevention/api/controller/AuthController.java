package com.systemprevention.api.controller;

import com.systemprevention.api.dto.AuthResponse;
import com.systemprevention.api.dto.LoginRequest;
import com.systemprevention.api.dto.RegisterRequest;
import com.systemprevention.api.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse cadastrar(@RequestBody @Valid RegisterRequest request) {
        return authService.cadastrar(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody @Valid LoginRequest request) {
        return authService.login(request);
    }
}
