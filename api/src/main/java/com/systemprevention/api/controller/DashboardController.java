package com.systemprevention.api.controller;

import com.systemprevention.api.dto.DashboardItemResponse;
import com.systemprevention.api.dto.DashboardResumoResponse;
import com.systemprevention.api.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/resumo")
    public DashboardResumoResponse buscarResumo() {
        return dashboardService.buscarResumo();
    }

    @GetMapping("/status")
    public List<DashboardItemResponse> buscarStatus() {
        return dashboardService.buscarStatus();
    }

    @GetMapping("/canais")
    public List<DashboardItemResponse> buscarCanais() {
        return dashboardService.buscarCanais();
    }

    @GetMapping("/tipos-golpe")
    public List<DashboardItemResponse> buscarTiposGolpe() {
        return dashboardService.buscarTiposGolpe();
    }

    @GetMapping("/mensal")
    public List<DashboardItemResponse> buscarMensal() {
    return dashboardService.buscarMensal();
    }
}
