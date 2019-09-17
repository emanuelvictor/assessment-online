package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.avaliacao.Avaliacao;
import br.com.ubest.domain.entity.avaliacao.TipoAvaliacao;
import br.com.ubest.domain.entity.unidade.Unidade;
import br.com.ubest.domain.entity.usuario.Perfil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

//    (final long id, final String fotoPath, final @NotNull int nota, final @NotNull LocalDateTime data, final Unidade unidade, final TipoAvaliacao tipoAvaliacao)

    @Query("SELECT new Avaliacao (" +
            "           avaliacao.id," +
            "           avaliacao.fotoPath," +
            "           avaliacao.nota," +
            "           avaliacao.data," +
            "           agrupador," +
            "           unidade," +
            "           tipoAvaliacao" +
            "       ) " +
            "   FROM Avaliacao avaliacao " +
            "       INNER JOIN AvaliacaoAvaliavel avaliacaoAvaliavel ON avaliacaoAvaliavel.avaliacao.id = avaliacao.id " +
            "       INNER JOIN Agrupador agrupador ON avaliacao.agrupador.id = agrupador.id " +
            "       INNER JOIN Unidade unidade ON avaliacaoAvaliavel.avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade.id = unidade.id " +
            "       INNER JOIN Dispositivo dispositivo ON avaliacaoAvaliavel.avaliavel.unidadeTipoAvaliacaoDispositivo.dispositivo.id = dispositivo.id " +
            "       INNER JOIN TipoAvaliacao tipoAvaliacao ON avaliacaoAvaliavel.avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.tipoAvaliacao.id = tipoAvaliacao.id " +
            "       INNER JOIN Usuario usuario ON avaliacaoAvaliavel.avaliavel.usuario.id = usuario.id " +
//            "       LEFT OUTER JOIN Operador operador ON operador.usuario.id = usuario.id " +
            "   WHERE " +
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
            "           (" +
            "               dispositivo.id IN :dispositivosFilter" +
            "           )" +
            "           OR :dispositivosFilter IS NULL" +
            "       )" +
            "       AND " +
            "       (" +
            "           (" +
            "               unidade.id IN :unidadesFilter" +
            "           )" +
            "           OR :unidadesFilter IS NULL" +
            "       )" +
            "       AND " +
            "       (" +
            "           (" +
            "               usuario.id IN :usuariosFilter" +
            "           )" +
            "           OR :usuariosFilter IS NULL" +
            "       )" +
            "       AND " +
            "       (" +
            "           (" +
            "               tipoAvaliacao.id IN :tiposAvaliacoesFilter" +
            "           )" +
            "           OR :tiposAvaliacoesFilter IS NULL" +
            "       )" +
            "       AND " +
            "       (" +
            "           FILTER(:defaultFilter, avaliacao.agrupador.feedback) = TRUE" +
            "       )" +
            "       AND " +
            "       (" +
            "           (:hasFeedback IS NOT NULL AND avaliacao.agrupador.feedback IS NOT NULL)" +
            "           OR :hasFeedback IS NULL" +
            "       )" +
            "       AND" +
            "       (" +
            "           (:perfil != '" + Perfil.ADMINISTRADOR_VALUE + "' AND :perfil != '" + Perfil.ROOT_VALUE + "') " +
            "           AND unidade.id IN " +
            "           (" +
            "               SELECT operador.unidade.id FROM Operador operador WHERE " +
            "               (" +
            "                   operador.usuario.id = :usuarioId" +
            "               )" +
            "           ) OR (:perfil = '" + Perfil.ADMINISTRADOR_VALUE + "' OR :perfil = '" + Perfil.ROOT_VALUE + "')" +
            "       )" +
            "   )" +
            "GROUP BY avaliacao.id, avaliacao.nota, avaliacao.fotoPath, avaliacao.data, unidade.id, unidade.nome, dispositivo.id, tipoAvaliacao.id, agrupador.id, agrupador.feedback "
    )
    Page<Avaliacao> listByFilters(@Param("usuarioId") final Long usuarioId,
                                  @Param("perfil") final String perfil,
                                  @Param("defaultFilter") final String defaultFilter,
                                  @Param("unidadesFilter") final List<Long> unidadesFilter,
                                  @Param("dispositivosFilter") final List<Long> dispositivosFilter,
                                  @Param("usuariosFilter") final List<Long> usuariosFilter,
                                  @Param("tiposAvaliacoesFilter") final List<Long> tiposAvaliacoesFilter,
                                  @Param("hasFeedback") final Boolean hasFeedback,
                                  @Param("dataInicioFilter") final LocalDateTime dataInicioFilter,
                                  @Param("dataTerminoFilter") final LocalDateTime dataTerminoFilter,
                                  final Pageable pageable);

}
