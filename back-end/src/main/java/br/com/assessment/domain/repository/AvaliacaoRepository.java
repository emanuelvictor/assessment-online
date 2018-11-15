package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.avaliacao.Avaliacao;
import br.com.assessment.domain.entity.usuario.Perfil;
import br.com.assessment.domain.entity.usuario.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sun.security.x509.AVA;

import java.time.LocalDateTime;
import java.util.List;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

    @Query("SELECT new Avaliacao ( " +
            "   avaliacao.id, " +
            "   avaliacao.fotoPath, " +
            "   avaliacao.nota, " +
            "   avaliacao.data, " +
            "   MAX(unidade)" +
            " ) FROM Avaliacao avaliacao " +
            "       LEFT OUTER JOIN AvaliacaoColaborador avaliacaoColaborador ON avaliacaoColaborador.avaliacao.id = avaliacao.id " +
            "       LEFT OUTER JOIN Unidade unidade ON avaliacaoColaborador.colaborador.unidade.id = unidade.id " +
            "       LEFT OUTER JOIN Usuario usuario ON avaliacaoColaborador.colaborador.usuario.id = usuario.id " +
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
            "   )" +
            "GROUP BY avaliacao.id, avaliacao.nota, avaliacao.fotoPath, avaliacao.data, unidade.nome"
    )
    Page<Avaliacao> listByFilters(
            @Param("unidadesFilter") final List<Long> unidadesFilter,
            @Param("usuariosFilter") final List<Long> usuariosFilter,
            @Param("dataInicioFilter") final LocalDateTime dataInicioFilter,
            @Param("dataTerminoFilter") final LocalDateTime dataTerminoFilter,
            final Pageable pageable);

    /**
     *
     * @param avaliacaoId long
     * @return Avaliacao
     */
    @Query("FROM Avaliacao avaliacao WHERE avaliacao.id = :avaliacaoId")
    Avaliacao findAvaliacaoById(@Param("avaliacaoId") final long avaliacaoId);
}
