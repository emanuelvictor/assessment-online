package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.assinatura.Fatura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface FaturaRepository extends JpaRepository<Fatura, Long> {


    /**
     *
     */
    @Query("SELECT max(fatura.creted) FROM Fatura fatura ")
    Optional<Fatura> findLast();
}
