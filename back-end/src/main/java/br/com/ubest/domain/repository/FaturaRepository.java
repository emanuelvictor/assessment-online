package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.assinatura.Fatura;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface FaturaRepository extends JpaRepository<Fatura, Long> {


    /**
     *
     */
    @Query("FROM Fatura fatura WHERE fatura.tenant = :tenant " +
            "AND (" +
            "   fatura.dataAbertura = (SELECT MAX(faturaInner.dataAbertura) FROM Fatura faturaInner WHERE faturaInner.tenant = :tenant)" +
            ")")
    List<Fatura> findLastsFaturasByTenant(@Param("tenant") final String tenant);

    /**
     * @param tenant
     * @param pageable
     * @return
     */
    @Query("FROM Fatura fatura WHERE " +
            "(" +
            "   ((:tenant IS NOT NULL AND fatura.tenant = :tenant) OR :tenant IS NULL)" +
            ")")
    Page<Fatura> listByFilters(@Param("tenant") final String tenant,/* @Param("defaultFilter") String defaultFilter, */final Pageable pageable);

    /**
     *
     * @param tenant
     * @param date
     * @return
     */
    @Query("FROM Fatura fatura WHERE fatura.tenant = :tenant " +
            "AND (" +
            "   fatura.dataAbertura >= :date" +
            ")")
    List<Fatura> next(@Param("tenant") final String tenant, @Param("date") final LocalDate date);
}
