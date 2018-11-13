package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.usuario.Perfil;
import br.com.assessment.domain.entity.usuario.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    @Query("SELECT new Usuario( " +
            "   usuario.id, " +
            "   usuario.nome, " +
            "   usuario.conta.email, " +
            "   usuario.thumbnailPath,  " +
            "   usuario.avatarPath, " +
            "   usuario.fotoPath, " +
            "   AVG(CASE WHEN avaliacao.nota IS NULL THEN 0 ELSE avaliacao.nota END) AS media," +
            "   COUNT(avaliacao) AS quantidadeAvaliacoes," +
            "   COUNT(av1) AS avaliacoes1," +
            "   COUNT(av2) AS avaliacoes2," +
            "   COUNT(av3) AS avaliacoes3," +
            "   COUNT(av4) AS avaliacoes4," +
            "   COUNT(av5) AS avaliacoes5" +
            ") FROM Usuario usuario " +
            "       LEFT OUTER JOIN Colaborador colaborador ON colaborador.usuario.id = usuario.id " +
            "       LEFT OUTER JOIN AvaliacaoColaborador avaliacaoColaborador ON avaliacaoColaborador.colaborador.id = colaborador.id " +
            "       LEFT OUTER JOIN Avaliacao avaliacao ON avaliacao.id = avaliacaoColaborador.avaliacao.id " +
            "       LEFT OUTER JOIN Avaliacao av1 ON (av1.id = avaliacaoColaborador.avaliacao.id AND av1.nota = 1) " +
            "       LEFT OUTER JOIN Avaliacao av2 ON (av2.id = avaliacaoColaborador.avaliacao.id AND av2.nota = 2) " +
            "       LEFT OUTER JOIN Avaliacao av3 ON (av3.id = avaliacaoColaborador.avaliacao.id AND av3.nota = 3) " +
            "       LEFT OUTER JOIN Avaliacao av4 ON (av4.id = avaliacaoColaborador.avaliacao.id AND av4.nota = 4) " +
            "       LEFT OUTER JOIN Avaliacao av5 ON (av5.id = avaliacaoColaborador.avaliacao.id AND av5.nota = 5) " +
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
            "               FILTER(:defaultFilter, usuario.nome, usuario.conta.email) = TRUE" +
            "       )" +
            "       AND " +
            "       (" +
            "           (" +
            "               usuario.id IN " +
            "               (" +
            "                   SELECT colaborador.usuario.id FROM Colaborador colaborador WHERE " +
            "                   (" +
            "                       colaborador.unidade.id  IN :unidadesFilter " +
            "                   )" +
            "               )" +
            "           )" +
            "           OR :unidadesFilter IS NULL" +
            "       )" +
            "       AND " +
            "       (" +
            "           (" +
            "               :perfil != '" + Perfil.ADMINISTRADOR_VALUE + "' " +
            "               AND " +
            "               colaborador.vinculo < 3 AND colaborador.unidade.id IN " +
            "               (" +
            "                   SELECT operador.unidade.id FROM Colaborador operador WHERE " +
            "                   (" +
            "                           operador.usuario.id = :usuarioId" +
            "                       AND (operador.vinculo = 1 OR operador.vinculo = 2)" +
            "                   )" +
            "               )" +
            "           )" +
            "           OR :perfil = '" + Perfil.ADMINISTRADOR_VALUE + "' " +
            "       )" +
            "   )" +
            "GROUP BY usuario.id, usuario.nome, usuario.conta.email, usuario.thumbnailPath, usuario.avatarPath, usuario.fotoPath"
    )
    Page<Usuario> listByFilters(
            @Param("usuarioId") final Long usuarioId,
            @Param("perfil") final String perfil,
            @Param("defaultFilter") final String defaultFilter,
            @Param("unidadesFilter") final List<Long> unidadesFilter,
            @Param("dataInicioFilter") final LocalDateTime dataInicioFilter,
            @Param("dataTerminoFilter") final LocalDateTime dataTerminoFilter,
            final Pageable pageable);

    @Query("SELECT new Usuario( " +
            "   usuario.id, " +
            "   usuario.nome, " +
            "   usuario.conta.email, " +
            "   usuario.thumbnailPath,  " +
            "   usuario.avatarPath, " +
            "   usuario.fotoPath, " +
            "   AVG(CASE WHEN avaliacao.nota IS NULL THEN 0 ELSE avaliacao.nota END) AS media," +
            "   COUNT(avaliacao) AS quantidadeAvaliacoes," +
            "   COUNT(av1) AS avaliacoes1," +
            "   COUNT(av2) AS avaliacoes2," +
            "   COUNT(av3) AS avaliacoes3," +
            "   COUNT(av4) AS avaliacoes4," +
            "   COUNT(av5) AS avaliacoes5" +
            ") FROM Usuario usuario " +
            "       LEFT OUTER JOIN Colaborador colaborador ON colaborador.usuario.id = usuario.id " +
            "       LEFT OUTER JOIN AvaliacaoColaborador avaliacaoColaborador ON avaliacaoColaborador.colaborador.id = colaborador.id " +
            "       LEFT OUTER JOIN Avaliacao avaliacao ON avaliacao.id = avaliacaoColaborador.avaliacao.id " +
            "       LEFT OUTER JOIN Avaliacao av1 ON (av1.id = avaliacaoColaborador.avaliacao.id AND av1.nota = 1) " +
            "       LEFT OUTER JOIN Avaliacao av2 ON (av2.id = avaliacaoColaborador.avaliacao.id AND av2.nota = 2) " +
            "       LEFT OUTER JOIN Avaliacao av3 ON (av3.id = avaliacaoColaborador.avaliacao.id AND av3.nota = 3) " +
            "       LEFT OUTER JOIN Avaliacao av4 ON (av4.id = avaliacaoColaborador.avaliacao.id AND av4.nota = 4) " +
            "       LEFT OUTER JOIN Avaliacao av5 ON (av5.id = avaliacaoColaborador.avaliacao.id AND av5.nota = 5) " +
            "   WHERE " +
            "   ( " +
            "       usuario.id = :usuarioId" +
            "   )" +
            "GROUP BY usuario.id, usuario.nome, usuario.conta.email, usuario.thumbnailPath, usuario.avatarPath, usuario.fotoPath"
    )
    Usuario findUsuarioByIdAndReturnAvaliacoes(@Param("usuarioId") final Long usuarioId);

    List<Usuario> findByNome(final String nome);

    @Query("FROM Usuario usuario WHERE " +
            "           usuario.id IN " +
            "           (" +
            "               SELECT colaborador.usuario.id FROM Colaborador colaborador WHERE " +
            "               (" +
            "                   colaborador.unidade.id = :unidadeId AND " +
            "                   (" +
            "                       (" +
            "                           (colaborador.vinculo = 1 OR colaborador.vinculo = 2)" +
            "                       )" +
            "                       OR colaborador.usuario.conta.administrador = TRUE" +
            "                   )" +
            "               )" +
            "           )"
    )
    List<Usuario> listUsuariosByUnidadeId(@Param("unidadeId") final Long unidadeId);
}
