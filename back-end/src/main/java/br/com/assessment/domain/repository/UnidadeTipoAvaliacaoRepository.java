package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.avaliacao.UnidadeTipoAvaliacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UnidadeTipoAvaliacaoRepository extends JpaRepository<UnidadeTipoAvaliacao, Long> {

    @Query("SELECT unidadeTipoAvaliacao FROM UnidadeTipoAvaliacao unidadeTipoAvaliacao WHERE" +
            "   (" +
            "       FILTER(:defaultFilter, unidadeTipoAvaliacao.tipoAvaliacao.nome, unidadeTipoAvaliacao.tipoAvaliacao.enunciado) = TRUE" +
            "       AND ( (:unidadeId IS NOT NULL AND unidadeTipoAvaliacao.unidade.id = :unidadeId) OR :unidadeId IS NULL)" +
            "       AND ( (:tipoAvaliacaoId IS NOT NULL AND unidadeTipoAvaliacao.tipoAvaliacao.id = :tipoAvaliacaoId) OR :tipoAvaliacaoId IS NULL)" +
            "       AND ((:ativo IS NOT NULL AND unidadeTipoAvaliacao.ativo = :ativo) OR :ativo IS NULL)" +
            "   )"
    )
    Page<UnidadeTipoAvaliacao> listByFilters(
            @Param("defaultFilter") final String defaultFilter,
            @Param("tipoAvaliacaoId") final Long tipoAvaliacaoId,
            @Param("unidadeId") final Long unidadeId,
            @Param("ativo") final Boolean ativo,
            final Pageable pageable);

}
