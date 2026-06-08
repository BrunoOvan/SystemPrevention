package com.systemprevention.api.service;

import com.systemprevention.api.dto.AuthResponse;
import com.systemprevention.api.dto.LoginRequest;
import com.systemprevention.api.dto.RegisterRequest;
import com.systemprevention.api.model.Usuario;
import com.systemprevention.api.repository.UsuarioRepository;
import com.systemprevention.api.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse cadastrar(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new RuntimeException("E-mail já cadastrado.");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.nome())
                .email(request.email())
                .senha(passwordEncoder.encode(request.senha()))
                .criadoEm(LocalDateTime.now())
                .build();

        usuarioRepository.save(usuario);

        String token = jwtService.gerarToken(usuario);

        return new AuthResponse(
                token,
                usuario.getNome(),
                usuario.getEmail()
        );
    }

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        boolean senhaValida = passwordEncoder.matches(
                request.senha(),
                usuario.getSenha()
        );

        if (!senhaValida) {
            throw new RuntimeException("Senha inválida.");
        }

        String token = jwtService.gerarToken(usuario);

        return new AuthResponse(
                token,
                usuario.getNome(),
                usuario.getEmail()
        );
    }
}