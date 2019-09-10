package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.assinatura.Assinatura;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssinaturaRepository extends JpaRepository<Assinatura, Long> {
}
