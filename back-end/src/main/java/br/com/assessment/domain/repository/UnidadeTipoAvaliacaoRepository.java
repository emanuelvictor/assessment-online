package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.avaliacao.UnidadeTipoAvaliacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UnidadeTipoAvaliacaoRepository extends JpaRepository<UnidadeTipoAvaliacao, Long> {

    @Query("SELECT unidadeTipoAvaliacao FROM UnidadeTipoAvaliacao unidadeTipoAvaliacao " +
            "   WHERE(FILTER(:defaultFilter, unidadeTipoAvaliacao.tipoAvaliacao.nome, unidadeTipoAvaliacao.tipoAvaliacao.enunciado) = TRUE)"
    )
    Page<UnidadeTipoAvaliacao> listByFilters(
            @Param("defaultFilter") final String defaultFilter,
            final Pageable pageable);

}
