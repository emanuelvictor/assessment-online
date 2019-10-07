package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.assinatura.Cupom;
import br.com.ubest.domain.entity.usuario.Conta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CupomRepository extends JpaRepository<Cupom, Long> {


    /**
     *
     */
    @Query("SELECT new Cupom( " +
            "   cupom.id, " +
            "   cupom.codigo " +
            ") FROM Cupom cupom" +
            "   WHERE" +
            "   (   " +
            "       (" +
            "           FILTER(:defaultFilter, cupom.codigo) = TRUE" +
            "       )" +
            "   )" +
            "GROUP BY cupom.id, cupom.codigo"
    )
    Page<Cupom> listByFilters(@Param("defaultFilter") final String defaultFilter, final Pageable pageable);

}
