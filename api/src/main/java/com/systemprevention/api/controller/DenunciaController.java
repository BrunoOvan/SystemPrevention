package com.systemprevention.api.controller;

import com.systemprevention.api.dto.DenunciaRequest;
import com.systemprevention.api.dto.DenunciaResponse;
import com.systemprevention.api.model.Usuario;
import com.systemprevention.api.service.DenunciaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/denuncias")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DenunciaController {

    private final DenunciaService denunciaService;

    @PostMapping
    public DenunciaResponse registrar(
            @RequestBody @Valid DenunciaRequest request,
            Authentication authentication
    ) {
        Usuario usuario = (Usuario) authentication.getPrincipal();

        return denunciaService.registrar(request, usuario);
    }

    @GetMapping
    public List<DenunciaResponse> listarTodas() {
        return denunciaService.listarTodas();
    }

    @GetMapping("/minhas")
    public List<DenunciaResponse> listarMinhas(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();

        return denunciaService.listarPorUsuario(usuario);
    }

    @GetMapping("/protocolo/{protocolo}")
    public DenunciaResponse buscarPorProtocolo(@PathVariable String protocolo) {
        return denunciaService.buscarPorProtocolo(protocolo);
    }
}