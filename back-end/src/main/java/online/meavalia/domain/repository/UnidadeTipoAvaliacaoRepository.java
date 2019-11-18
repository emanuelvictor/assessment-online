package online.meavalia.domain.repository;

import online.meavalia.domain.entity.avaliacao.UnidadeTipoAvaliacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UnidadeTipoAvaliacaoRepository extends JpaRepository<UnidadeTipoAvaliacao, Long> {

    /**
     * @param defaultFilter
     * @param tipoAvaliacaoId
     * @param unidadeId
     * @param ativo
     * @param idsFilter
     * @param pageable
     * @return
     */
    @Query("SELECT unidadeTipoAvaliacao FROM UnidadeTipoAvaliacao unidadeTipoAvaliacao" +
            " WHERE" +
            "   (" +
            "       FILTER(:defaultFilter, unidadeTipoAvaliacao.tipoAvaliacao.nome, unidadeTipoAvaliacao.tipoAvaliacao.enunciado) = TRUE" +
            "       AND ( (:unidadeId IS NOT NULL AND unidadeTipoAvaliacao.unidade.id = :unidadeId) OR :unidadeId IS NULL)" +
            "       AND ( (:tipoAvaliacaoId IS NOT NULL AND unidadeTipoAvaliacao.tipoAvaliacao.id = :tipoAvaliacaoId) OR :tipoAvaliacaoId IS NULL)" +
            "       AND ((:ativo IS NOT NULL AND unidadeTipoAvaliacao.ativo = :ativo) OR :ativo IS NULL)" +
            "       AND" +
            "       (" +
            "           (" +
            "               unidadeTipoAvaliacao.id IN (SELECT avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.id FROM Avaliavel avaliavel " +
            "               WHERE" +
            "               (" +
            "                   avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.id = unidadeTipoAvaliacao.id AND avaliavel.ativo IS TRUE" +
            "               ))" +
            "           )" +
            "       )" +
            "       AND" +
            "       (" +
            "           (" +
            "               unidadeTipoAvaliacao.id IN :idsFilter" +
            "           ) OR :idsFilter IS NULL" +
            "       )" +
            "   )"
    )
    Page<UnidadeTipoAvaliacao> listByFiltersAndWithAvaliaveis(@Param("defaultFilter") final String defaultFilter,
                                                              @Param("tipoAvaliacaoId") final Long tipoAvaliacaoId,
                                                              @Param("unidadeId") final Long unidadeId,
                                                              @Param("ativo") final Boolean ativo,
                                                              @Param("idsFilter") final List<Long> idsFilter,
                                                              final Pageable pageable);

    /**
     * @param defaultFilter
     * @param tipoAvaliacaoId
     * @param unidadeId
     * @param ativo
     * @param pageable
     * @return
     */
    @Query("SELECT unidadeTipoAvaliacao FROM UnidadeTipoAvaliacao unidadeTipoAvaliacao WHERE" +
            "   (" +
            "       FILTER(:defaultFilter, unidadeTipoAvaliacao.tipoAvaliacao.nome, unidadeTipoAvaliacao.tipoAvaliacao.enunciado) = TRUE" +
            "       AND ( (:unidadeId IS NOT NULL AND unidadeTipoAvaliacao.unidade.id = :unidadeId) OR :unidadeId IS NULL)" +
            "       AND ( (:tipoAvaliacaoId IS NOT NULL AND unidadeTipoAvaliacao.tipoAvaliacao.id = :tipoAvaliacaoId) OR :tipoAvaliacaoId IS NULL)" +
            "       AND ((:ativo IS NOT NULL AND unidadeTipoAvaliacao.ativo = :ativo) OR :ativo IS NULL)" +
            "   )"
    )
    Page<UnidadeTipoAvaliacao> listByFilters(@Param("defaultFilter") final String defaultFilter,
                                             @Param("tipoAvaliacaoId") final Long tipoAvaliacaoId,
                                             @Param("unidadeId") final Long unidadeId,
                                             @Param("ativo") final Boolean ativo,
                                             final Pageable pageable);


    /**
     * @param unidadeId
     * @return
     */
    List<UnidadeTipoAvaliacao> findAllByUnidadeId(final long unidadeId);

    /**
     * @param tipoAvaliacaoId
     * @return
     */
    List<UnidadeTipoAvaliacao> findAllByTipoAvaliacaoId(final long tipoAvaliacaoId);

    /**
     * @param unidadeId
     * @param tipoAvaliacaoId
     * @return
     */
    UnidadeTipoAvaliacao findByUnidadeIdAndTipoAvaliacaoId(final long unidadeId, final long tipoAvaliacaoId);
}
