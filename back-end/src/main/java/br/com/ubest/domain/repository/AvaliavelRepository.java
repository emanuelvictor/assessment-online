package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.usuario.vinculo.Avaliavel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Set;

public interface AvaliavelRepository extends JpaRepository<Avaliavel, Long> {

    /**
     * @param defaultFilter
     * @param usuarioId
     * @param unidadeId
     * @param ativo
     * @param unidadeTipoAvaliacaoDispositivoId
     * @param pageable
     * @return
     */
    @Query(
            " SELECT avaliavel FROM Avaliavel avaliavel WHERE" +
                    "(" +
                    "   (" +
                    "       (:unidadeId IS NULL AND (:usuarioId IS NOT NULL AND avaliavel.usuario.id = :usuarioId)) " +
                    "       OR " +
                    "       (:usuarioId IS NULL AND (:unidadeId IS NOT NULL AND avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade.id = :unidadeId))" +
                    "       OR :usuarioId IS NULL AND :unidadeId IS NULL " +
                    "   )" +
                    "   AND " +
                    "   (" +
                    "       (:unidadeTipoAvaliacaoDispositivoId IS NOT NULL AND avaliavel.unidadeTipoAvaliacaoDispositivo.id = :unidadeTipoAvaliacaoDispositivoId)" +
                    "       OR :unidadeTipoAvaliacaoDispositivoId IS NULL  " +
                    "   )" +
                    "   AND " +
                    "   (" +
                    "       (:ativo IS NOT NULL AND avaliavel.ativo = :ativo)" +
                    "       OR :ativo IS NULL " +
                    "   )" +
                    "   AND (" +
                    "           FILTER(:defaultFilter, avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade.nome) = TRUE" +
                    "       OR " +
                    "           (" +
                    "               FILTER(:defaultFilter, avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.tipoAvaliacao.nome, avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.tipoAvaliacao.selecao, avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.tipoAvaliacao.enunciado) = TRUE" +
                    "           )" +
                    "       )" +
                    ")"
    )
    Page<Avaliavel> listByFilters(@Param("defaultFilter") final String defaultFilter,
                                  @Param("usuarioId") final Long usuarioId,
                                  @Param("unidadeId") final Long unidadeId,
                                  @Param("ativo") final Boolean ativo,
                                  @Param("unidadeTipoAvaliacaoDispositivoId") final Long unidadeTipoAvaliacaoDispositivoId,
                                  final Pageable pageable);

    /**
     * @param unidadeTipoAvaliacaoId
     * @return
     */
    @Query(" SELECT avaliavel FROM Avaliavel avaliavel WHERE avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.id = :unidadeTipoAvaliacaoId")
    Set<Avaliavel> findAllByUnidadeTipoAvaliacaoId(@Param("unidadeTipoAvaliacaoId") final long unidadeTipoAvaliacaoId);

    /**
     * @param usuarioId
     * @return
     */
    Set<Avaliavel> findAllByUsuarioId(final long usuarioId);

}
