package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.assinatura.Fatura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FaturaRepository extends JpaRepository<Fatura, Long> {


    /**
     *
     */
    @Query("FROM Fatura fatura WHERE fatura.tenant = :tenant ORDER BY (fatura.created) DESC")
    List<Fatura> findLastByTenant(@Param("tenant") final String tenant);
}
