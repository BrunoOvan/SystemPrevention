package com.systemprevention.api.service;

import com.systemprevention.api.dto.DashboardItemResponse;
import com.systemprevention.api.dto.DashboardResumoResponse;
import com.systemprevention.api.model.CanalContato;
import com.systemprevention.api.model.Denuncia;
import com.systemprevention.api.model.NivelRisco;
import com.systemprevention.api.model.StatusDenuncia;
import com.systemprevention.api.model.TipoGolpe;
import com.systemprevention.api.repository.DenunciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.time.Month;
import java.time.format.TextStyle;
import java.util.Locale;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DenunciaRepository denunciaRepository;

    public DashboardResumoResponse buscarResumo() {
        long totalDenuncias = denunciaRepository.count();

        long casosAnalisados = denunciaRepository.countByStatus(StatusDenuncia.CONCLUIDO);

        long riscoAlto = denunciaRepository.countByNivelRisco(NivelRisco.ALTO)
                + denunciaRepository.countByNivelRisco(NivelRisco.CRITICO);

        String golpeMaisRelatado = buscarGolpeMaisRelatado();

        return new DashboardResumoResponse(
                totalDenuncias,
                casosAnalisados,
                riscoAlto,
                golpeMaisRelatado
        );
    }

    public List<DashboardItemResponse> buscarStatus() {
        return Arrays.stream(StatusDenuncia.values())
                .map(status -> new DashboardItemResponse(
                        formatarNome(status.name()),
                        denunciaRepository.countByStatus(status)
                ))
                .toList();
    }

    public List<DashboardItemResponse> buscarCanais() {
        List<Denuncia> denuncias = denunciaRepository.findAll();

        return Arrays.stream(CanalContato.values())
                .map(canal -> new DashboardItemResponse(
                        formatarNome(canal.name()),
                        denuncias.stream()
                                .filter(denuncia -> denuncia.getCanal() == canal)
                                .count()
                ))
                .toList();
    }

    public List<DashboardItemResponse> buscarTiposGolpe() {
        List<Denuncia> denuncias = denunciaRepository.findAll();

        return Arrays.stream(TipoGolpe.values())
                .map(tipo -> new DashboardItemResponse(
                        formatarNome(tipo.name()),
                        denuncias.stream()
                                .filter(denuncia -> denuncia.getTipoGolpe() == tipo)
                                .count()
                ))
                .sorted(Comparator.comparingLong(DashboardItemResponse::quantidade).reversed())
                .toList();
    }

    private String buscarGolpeMaisRelatado() {
        return buscarTiposGolpe()
                .stream()
                .filter(item -> item.quantidade() > 0)
                .findFirst()
                .map(DashboardItemResponse::nome)
                .orElse("Nenhum registro");
    }

    private String formatarNome(String valor) {
        if (valor.equals("OUTRO")) {
            return "Outros";
        }
        String texto = valor.toLowerCase().replace("_", " ");

        String[] palavras = texto.split(" ");
        StringBuilder resultado = new StringBuilder();

        for (String palavra : palavras) {
            if (!palavra.isBlank()) {
                resultado.append(Character.toUpperCase(palavra.charAt(0)))
                        .append(palavra.substring(1))
                        .append(" ");
            }
        }

        return resultado.toString().trim();
    }


public List<DashboardItemResponse> buscarMensal() {
    List<Denuncia> denuncias = denunciaRepository.findAll();

    return Arrays.stream(Month.values())
            .map(mes -> {
                long quantidade = denuncias.stream()
                        .filter(denuncia -> denuncia.getCriadoEm() != null)
                        .filter(denuncia -> denuncia.getCriadoEm().getMonth() == mes)
                        .count();

                String nomeMes = mes.getDisplayName(TextStyle.SHORT, new Locale("pt", "BR"));

                return new DashboardItemResponse(
                        nomeMes.substring(0, 1).toUpperCase() + nomeMes.substring(1),
                        quantidade
                );
            })
            .toList();

        }
}