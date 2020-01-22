package online.meavalia.domain.repository;

import online.meavalia.domain.entity.unidade.UnidadeTipoAvaliacaoDispositivo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UnidadeTipoAvaliacaoDispositivoRepository extends JpaRepository<UnidadeTipoAvaliacaoDispositivo, Long> {

    /**
     * @param defaultFilter
     * @param dispositivoId
     * @param unidadeTipoAvaliacaoId
     * @param ativo
     * @param withAvaliaveis
     * @param pageable
     * @return
     */
    @Query("FROM UnidadeTipoAvaliacaoDispositivo unidadeTipoAvaliacaoDispositivo WHERE " +
            "   (   " +
            "       (" +
            "           (:withAvaliaveis IS NOT NULL AND" +
            "               unidadeTipoAvaliacaoDispositivo.id IN (SELECT avaliavel.unidadeTipoAvaliacaoDispositivo.id FROM Avaliavel avaliavel WHERE avaliavel.ativo = :withAvaliaveis) " +
            "           ) OR :withAvaliaveis IS NULL" +
            "       )" +
            "       AND" +
            "       ((:ativo IS NOT NULL AND unidadeTipoAvaliacaoDispositivo.ativo = :ativo) OR :ativo IS NULL)" +
            "       AND " +
            "       (" +
            "           FILTER(:defaultFilter, unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade.nome) = TRUE" +
            "       )" +
            "       AND" +
            "       (" +
            "           :dispositivoId IS NOT NULL AND " +
            "           (" +
            "               unidadeTipoAvaliacaoDispositivo.dispositivo.id = :dispositivoId" +
            "           )" +
            "           OR :dispositivoId IS NULL " +
            "       )" +
            "       AND" +
            "       (" +
            "           :unidadeTipoAvaliacaoId IS NOT NULL AND " +
            "           (" +
            "               unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.id = :unidadeTipoAvaliacaoId" +
            "           )" +
            "           OR :unidadeTipoAvaliacaoId IS NULL " +
            "       )" +
            "   )")
    Page<UnidadeTipoAvaliacaoDispositivo> listByFilters(@Param("defaultFilter") final String defaultFilter,
                                                        @Param("dispositivoId") final Long dispositivoId,
                                                        @Param("unidadeTipoAvaliacaoId") final Long unidadeTipoAvaliacaoId,
                                                        @Param("ativo") final Boolean ativo,
                                                        @Param("withAvaliaveis") final Boolean withAvaliaveis,
                                                        final Pageable pageable);

    /**
     * @param id
     * @return
     */
    List<UnidadeTipoAvaliacaoDispositivo> findAllByUnidadeTipoAvaliacaoId(final long id);
}