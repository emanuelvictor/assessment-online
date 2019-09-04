package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.assinatura.Assinatura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AssinaturaRepository extends JpaRepository<Assinatura, Long> {
    List<Assinatura> findAssinaturaByTenant(@Param("tenant") String tenant);
}
