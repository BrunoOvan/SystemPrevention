package com.systemprevention.api.repository;

import com.systemprevention.api.model.Denuncia;
import com.systemprevention.api.model.NivelRisco;
import com.systemprevention.api.model.StatusDenuncia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DenunciaRepository extends JpaRepository<Denuncia, Long> {

    Optional<Denuncia> findByProtocolo(String protocolo);

    boolean existsByProtocolo(String protocolo);

    long countByStatus(StatusDenuncia status);

    long countByNivelRisco(NivelRisco nivelRisco);

    List<Denuncia> findByUsuarioId(Long usuarioId);
}