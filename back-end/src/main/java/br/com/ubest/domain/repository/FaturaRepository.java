package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.assinatura.Fatura;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FaturaRepository extends JpaRepository<Fatura, Long> {

}
