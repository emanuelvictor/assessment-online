package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.unidade.Unidade;
import br.com.ubest.domain.entity.usuario.Perfil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UnidadeRepository extends JpaRepository<Unidade, Long> {

    /**
     * @param defaultFilter     String
     * @param dataInicioFilter  LocalDateTime
     * @param dataTerminoFilter LocalDateTime
     * @param pageable          Pageable
     * @return Page<Unidade>
     */
    @Query("SELECT new Unidade( " +
            "   unidade.id, " +
            "   unidade.nome, " +
            "   AVG(avaliacao.nota) AS media," +
            "   COUNT(DISTINCT avaliacao.id) AS quantidadeAvaliacoes," +
            "   COUNT(DISTINCT av1.id) AS avaliacoes1," +
            "   COUNT(DISTINCT av2.id) AS avaliacoes2," +
            "   COUNT(DISTINCT av3.id) AS avaliacoes3," +
            "   COUNT(DISTINCT av4.id) AS avaliacoes4," +
            "   COUNT(DISTINCT av5.id) AS avaliacoes5" +
            ") FROM Unidade unidade " +
            "       LEFT OUTER JOIN UnidadeTipoAvaliacao unidadeTipoAvaliacao ON unidadeTipoAvaliacao.unidade.id = unidade.id " +
            "       LEFT OUTER JOIN TipoAvaliacao tipoAvaliacao ON tipoAvaliacao.id = unidadeTipoAvaliacao.tipoAvaliacao.id " +
            "       LEFT OUTER JOIN UnidadeTipoAvaliacaoDispositivo unidadeTipoAvaliacaoDispositivo ON unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.id = unidadeTipoAvaliacao.id " +
            "       LEFT OUTER JOIN Avaliavel avaliavel ON avaliavel.unidadeTipoAvaliacaoDispositivo.id = unidadeTipoAvaliacaoDispositivo.id " +
            "       LEFT OUTER JOIN AvaliacaoAvaliavel avaliacaoAvaliavel ON avaliacaoAvaliavel.avaliavel.id = avaliavel.id " +
            "       LEFT OUTER JOIN Avaliacao avaliacao ON avaliacao.id = avaliacaoAvaliavel.avaliacao.id " +
            "       LEFT OUTER JOIN Avaliacao av1 ON (av1.id = avaliacaoAvaliavel.avaliacao.id AND av1.nota = 1) " +
            "       LEFT OUTER JOIN Avaliacao av2 ON (av2.id = avaliacaoAvaliavel.avaliacao.id AND av2.nota = 2) " +
            "       LEFT OUTER JOIN Avaliacao av3 ON (av3.id = avaliacaoAvaliavel.avaliacao.id AND av3.nota = 3) " +
            "       LEFT OUTER JOIN Avaliacao av4 ON (av4.id = avaliacaoAvaliavel.avaliacao.id AND av4.nota = 4) " +
            "       LEFT OUTER JOIN Avaliacao av5 ON (av5.id = avaliacaoAvaliavel.avaliacao.id AND av5.nota = 5) " +
            "   WHERE" +
            "   (   " +
            "       (" +
            "           (" +
            "               ((cast(:dataInicioFilter AS date)) IS NOT NULL OR (cast(:dataTerminoFilter AS date)) IS NOT NULL) " +
            "               AND " +
            "               (" +
            "                   (" +
            "                           (cast(:dataInicioFilter AS date)) IS NOT NULL " +
            "                       AND (cast(:dataTerminoFilter AS date)) IS NOT NULL " +
            "                       AND :dataInicioFilter <= avaliacao.data AND avaliacao.data <= :dataTerminoFilter" +
            "                   )" +
            "                   OR" +
            "                   (" +
            "                           (cast(:dataInicioFilter AS date)) IS NOT NULL " +
            "                       AND (cast(:dataTerminoFilter AS date)) IS NULL " +
            "                       AND :dataInicioFilter <= avaliacao.data " +
            "                   )" +
            "                   OR" +
            "                   (" +
            "                           (cast(:dataInicioFilter AS date)) IS NULL " +
            "                       AND (cast(:dataTerminoFilter AS date)) IS NOT NULL " +
            "                       AND avaliacao.data <= :dataTerminoFilter " +
            "                   )" +
            "               )" +
            "           )" +
            "           OR ((cast(:dataInicioFilter AS date)) IS NULL AND (cast(:dataTerminoFilter AS date)) IS NULL)" +
            "       )" +
            "       AND " +
            "       (" +
            "           FILTER(:defaultFilter, unidade.nome) = TRUE" +
            "       )" +
            "       AND " +
            "       (" +
            "           tipoAvaliacao.id IN :tiposAvaliacoesFilter" +
            "           OR :tiposAvaliacoesFilter IS NULL" +
            "       )" +
            "   )" +
            "GROUP BY unidade.id, unidade.nome"
    )
    Page<Unidade> listByFilters(@Param("defaultFilter") final String defaultFilter,
                                @Param("tiposAvaliacoesFilter") final List<Long> tiposAvaliacoesFilter,
                                @Param("dataInicioFilter") final LocalDateTime dataInicioFilter,
                                @Param("dataTerminoFilter") final LocalDateTime dataTerminoFilter,
                                final Pageable pageable);

    /**
     * @param defaultFilter String
     * @param pageable      Pageable
     * @return Page<Unidade>
     */
    @Query("SELECT new Unidade(" +
            "   unidade.id, " +
            "   unidade.nome " +
            ") FROM Unidade unidade " +
            "   WHERE " +
            "   (   " +
            "       (" +
            "           FILTER(:defaultFilter, unidade.nome) = TRUE" +
            "       )" +
            "       AND" +
            "       (" +
            "           :withBondFilter IS NOT NULL AND :withBondFilter IS TRUE AND " +
            "           (" +
            "               unidade.id IN (SELECT unidadeTipoAvaliacao.unidade.id FROM UnidadeTipoAvaliacao unidadeTipoAvaliacao " +
            "                               INNER JOIN UnidadeTipoAvaliacaoDispositivo unidadeTipoAvaliacaoDispositivo ON unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.id = unidadeTipoAvaliacao.id " +
            "                   WHERE" +
            "                   (" +
            "                       unidadeTipoAvaliacao.unidade.id = unidade.id AND unidadeTipoAvaliacao.ativo = :withBondFilter" +
            "                       AND unidadeTipoAvaliacaoDispositivo.ativo = :withBondFilter" +
            "                   )" +
            "               )" +
            "           )" +
            "           OR :withBondFilter IS NULL " +
            "       )" +
            "       AND" +
            "       (" +
            "           :withAvaliaveisFilter IS NOT NULL AND :withAvaliaveisFilter IS TRUE AND " +
            "           (" +
            "               unidade.id IN (SELECT unidadeTipoAvaliacao.unidade.id FROM UnidadeTipoAvaliacao unidadeTipoAvaliacao " +
            "                   WHERE" +
            "                   (" +
            "                       unidadeTipoAvaliacao.unidade.id = unidade.id AND unidadeTipoAvaliacao.id IN (SELECT avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.id FROM Avaliavel avaliavel WHERE (avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.id = unidadeTipoAvaliacao.id AND avaliavel.ativo IS TRUE))" +
            "                   )" +
            "               )" +
            "           )" +
            "           OR :withAvaliaveisFilter IS NULL " +
            "       )" +
            "       AND" +
            "       (" +
            "           :withUnidadesTiposAvaliacoesAtivasFilter IS NOT NULL AND " +
            "           (" +
            "               unidade.id IN (SELECT unidadeTipoAvaliacao.unidade.id FROM UnidadeTipoAvaliacao unidadeTipoAvaliacao " +
            "                   WHERE" +
            "                   (" +
            "                       unidadeTipoAvaliacao.unidade.id = unidade.id AND unidadeTipoAvaliacao.ativo = :withUnidadesTiposAvaliacoesAtivasFilter " +
            "                   )" +
            "               )" +
            "           )" +
            "           OR :withUnidadesTiposAvaliacoesAtivasFilter IS NULL " +
            "       )" +
            "       AND" +
            "       (" +
            "           (" +
            "               unidade.id IN :idsFilter" +
            "           ) OR :idsFilter IS NULL" +
            "       )" +
            "   )"
    )
    Page<Unidade> listByFilters(@Param("defaultFilter") final String defaultFilter,
                                @Param("withBondFilter") final Boolean withBondFilter,
                                @Param("withAvaliaveisFilter") final Boolean withAvaliaveisFilter,
                                @Param("withUnidadesTiposAvaliacoesAtivasFilter") final Boolean withUnidadesTiposAvaliacoesAtivasFilter,
                                @Param("idsFilter") final List<Long> idsFilter,
                                final Pageable pageable);

    /**
     *
     */
    @Query("SELECT new Unidade( " +
            "   unidade.id, " +
            "   unidade.nome, " +
            "   AVG(avaliacao.nota) AS media," +
            "   COUNT(avaliacao.id) AS quantidadeAvaliacoes," +
            "   COUNT(av1.id) AS avaliacoes1," +
            "   COUNT(av2.id) AS avaliacoes2," +
            "   COUNT(av3.id) AS avaliacoes3," +
            "   COUNT(av4.id) AS avaliacoes4," +
            "   COUNT(av5.id) AS avaliacoes5" +
            ") FROM Unidade unidade " +
            "       LEFT OUTER JOIN UnidadeTipoAvaliacao unidadeTipoAvaliacao ON unidadeTipoAvaliacao.unidade.id = unidade.id " +
            "       LEFT OUTER JOIN UnidadeTipoAvaliacaoDispositivo unidadeTipoAvaliacaoDispositivo ON unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.id = unidadeTipoAvaliacao.id " +
            "       LEFT OUTER JOIN Avaliavel avaliavel ON avaliavel.unidadeTipoAvaliacaoDispositivo.id = unidadeTipoAvaliacaoDispositivo.id " +
            "       LEFT OUTER JOIN AvaliacaoAvaliavel avaliacaoAvaliavel ON avaliacaoAvaliavel.avaliavel.id = avaliavel.id " +
            "       LEFT OUTER JOIN Avaliacao avaliacao ON avaliacao.id = avaliacaoAvaliavel.avaliacao.id " +
            "       LEFT OUTER JOIN Avaliacao av1 ON (av1.id = avaliacaoAvaliavel.avaliacao.id AND av1.nota = 1) " +
            "       LEFT OUTER JOIN Avaliacao av2 ON (av2.id = avaliacaoAvaliavel.avaliacao.id AND av2.nota = 2) " +
            "       LEFT OUTER JOIN Avaliacao av3 ON (av3.id = avaliacaoAvaliavel.avaliacao.id AND av3.nota = 3) " +
            "       LEFT OUTER JOIN Avaliacao av4 ON (av4.id = avaliacaoAvaliavel.avaliacao.id AND av4.nota = 4) " +
            "       LEFT OUTER JOIN Avaliacao av5 ON (av5.id = avaliacaoAvaliavel.avaliacao.id AND av5.nota = 5) " +
            "   WHERE (" +
            "   (   " +
            "       (" +
            "           (" +
            "               ((cast(:dataInicioFilter AS date)) IS NOT NULL OR (cast(:dataTerminoFilter AS date)) IS NOT NULL) " +
            "               AND " +
            "               (" +
            "                   (" +
            "                           (cast(:dataInicioFilter AS date)) IS NOT NULL " +
            "                       AND (cast(:dataTerminoFilter AS date)) IS NOT NULL " +
            "                       AND :dataInicioFilter <= avaliacao.data AND avaliacao.data <= :dataTerminoFilter" +
            "                   )" +
            "                   OR" +
            "                   (" +
            "                           (cast(:dataInicioFilter AS date)) IS NOT NULL " +
            "                       AND (cast(:dataTerminoFilter AS date)) IS NULL " +
            "                       AND :dataInicioFilter <= avaliacao.data " +
            "                   )" +
            "                   OR" +
            "                   (" +
            "                           (cast(:dataInicioFilter AS date)) IS NULL " +
            "                       AND (cast(:dataTerminoFilter AS date)) IS NOT NULL " +
            "                       AND avaliacao.data <= :dataTerminoFilter " +
            "                   )" +
            "               )" +
            "           )" +
            "           OR ((cast(:dataInicioFilter AS date)) IS NULL AND (cast(:dataTerminoFilter AS date)) IS NULL)" +
            "       )" +
            "   )" +
            "   AND :unidadeId = unidade.id) " +
            "GROUP BY unidade.id, unidade.nome"
    )
    Optional<Unidade> findUnidadeById(@Param("unidadeId") final Long unidadeId,
                                      @Param("dataInicioFilter") final LocalDateTime dataInicioFilter,
                                      @Param("dataTerminoFilter") final LocalDateTime dataTerminoFilter);

    /**
     * @param unidadeId {long}
     * @return Unidade
     */
    @Query("SELECT new Unidade( " +
            "   unidade.id, " +
            "   unidade.nome, " +
            "   AVG(avaliacao.nota) AS media," +
            "   COUNT(avaliacao) AS quantidadeAvaliacoes," +
            "   COUNT(av1) AS avaliacoes1," +
            "   COUNT(av2) AS avaliacoes2," +
            "   COUNT(av3) AS avaliacoes3," +
            "   COUNT(av4) AS avaliacoes4," +
            "   COUNT(av5) AS avaliacoes5" +
            ") FROM Unidade unidade " +
            "       LEFT OUTER JOIN UnidadeTipoAvaliacao unidadeTipoAvaliacao ON unidadeTipoAvaliacao.unidade.id = unidade.id " +
            "       LEFT OUTER JOIN UnidadeTipoAvaliacaoDispositivo unidadeTipoAvaliacaoDispositivo ON unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.id = unidadeTipoAvaliacao.id " +
            "       LEFT OUTER JOIN Avaliavel avaliavel ON avaliavel.unidadeTipoAvaliacaoDispositivo.id = unidadeTipoAvaliacaoDispositivo.id " +
            "       LEFT OUTER JOIN AvaliacaoAvaliavel avaliacaoAvaliavel ON avaliacaoAvaliavel.avaliavel.id = avaliavel.id " +
            "       LEFT OUTER JOIN Avaliacao avaliacao ON avaliacao.id = avaliacaoAvaliavel.avaliacao.id " +
            "       LEFT OUTER JOIN Avaliacao av1 ON (av1.id = avaliacaoAvaliavel.avaliacao.id AND av1.nota = 1) " +
            "       LEFT OUTER JOIN Avaliacao av2 ON (av2.id = avaliacaoAvaliavel.avaliacao.id AND av2.nota = 2) " +
            "       LEFT OUTER JOIN Avaliacao av3 ON (av3.id = avaliacaoAvaliavel.avaliacao.id AND av3.nota = 3) " +
            "       LEFT OUTER JOIN Avaliacao av4 ON (av4.id = avaliacaoAvaliavel.avaliacao.id AND av4.nota = 4) " +
            "       LEFT OUTER JOIN Avaliacao av5 ON (av5.id = avaliacaoAvaliavel.avaliacao.id AND av5.nota = 5) " +
            "   WHERE " +
            "   ( " +
            "       unidade.id = :unidadeId" +
            "   )" +
            "GROUP BY unidade.id, unidade.nome"
    )
    Unidade findUnidadeByIdAndReturnAvaliacoes(@Param("unidadeId") final Long unidadeId);

    /**
     * @param nome String
     * @return List<Unidade>
     */
    List<Unidade> findByNome(final String nome);
}
