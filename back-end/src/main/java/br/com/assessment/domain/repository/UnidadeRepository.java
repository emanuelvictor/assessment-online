package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.unidade.Unidade;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UnidadeRepository extends JpaRepository<Unidade, Long> {

    @Query("SELECT unidade FROM Unidade unidade WHERE FILTER(unidade.nome, :filters) = TRUE")
    Page<Unidade> listByFilters(@Param("filters") final String filters, final Pageable pageable);

}
