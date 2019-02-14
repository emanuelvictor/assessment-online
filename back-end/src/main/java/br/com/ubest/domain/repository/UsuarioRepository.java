package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.usuario.Perfil;
import br.com.ubest.domain.entity.usuario.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     *
     */
    @Query("SELECT new Usuario( " +
            "   usuario.id, " +
            "   usuario.nome, " +
            "   usuario.thumbnailPath,  " +
            "   usuario.avatarPath, " +
            "   usuario.fotoPath, " +
            "   usuario.conta" +
            ") FROM Usuario usuario " +
            "       LEFT OUTER JOIN Operador operador ON operador.usuario.id = usuario.id " +
            "   WHERE" +
            "   (   " +
            "       (" +
            "           FILTER(:defaultFilter, usuario.nome, usuario.conta.email) = TRUE" +
            "       )" +
            "       AND " +
            "       (" +
            "           (" +
            "               (:perfil != '" + Perfil.ADMINISTRADOR_VALUE + "' AND :perfil != '" + Perfil.ROOT_VALUE + "')" +
            "               AND " +
            "               operador.usuario.id = :usuarioId " +
            "           )" +
            "           OR (:perfil = '" + Perfil.ADMINISTRADOR_VALUE + "' OR :perfil = '" + Perfil.ROOT_VALUE + "')" +
            "       )" +
            "   )" +
            "GROUP BY usuario.id, usuario.nome, usuario.conta.email, usuario.thumbnailPath, usuario.avatarPath, usuario.fotoPath"
    )
    Page<Usuario> listByFilters(
            @Param("usuarioId") final Long usuarioId,
            @Param("perfil") final String perfil,
            @Param("defaultFilter") final String defaultFilter,
            final Pageable pageable);

    /**
     *
     */
    @Query("SELECT new Usuario( " +
            "   usuario.id, " +
            "   usuario.nome, " +
            "   usuario.thumbnailPath, " +
            "   usuario.avatarPath, " +
            "   usuario.fotoPath, " +
            "   AVG(avaliacao.nota) AS media," +
//            "  (CASE WHEN AVG(avaliacao.nota) IS NULL THEN 0.0 ELSE AVG(avaliacao.nota) END) AS media," +
            "   COUNT(avaliacao) AS quantidadeAvaliacoes," +
            "   COUNT(av1) AS avaliacoes1," +
            "   COUNT(av2) AS avaliacoes2," +
            "   COUNT(av3) AS avaliacoes3," +
            "   COUNT(av4) AS avaliacoes4," +
            "   COUNT(av5) AS avaliacoes5," +
            "   usuario.conta" +
            ") FROM Usuario usuario " +
            "       LEFT OUTER JOIN Operador operador ON operador.usuario.id = usuario.id " +
            "       LEFT OUTER JOIN Avaliavel avaliavel ON avaliavel.usuario.id = usuario.id " +
            "       LEFT OUTER JOIN UnidadeTipoAvaliacao unidadeTipoAvaliacao ON unidadeTipoAvaliacao.id = avaliavel.unidadeTipoAvaliacao.id " +
            "       LEFT OUTER JOIN Unidade unidade ON unidade.id = unidadeTipoAvaliacao.unidade.id " +
            "       LEFT OUTER JOIN AvaliacaoAvaliavel avaliacaoAvaliavel ON avaliacaoAvaliavel.avaliavel.id = avaliavel.id " +
            "       LEFT OUTER JOIN Avaliacao avaliacao ON avaliacao.id = avaliacaoAvaliavel.avaliacao.id " +
            "       LEFT OUTER JOIN Avaliacao av1 ON (av1.id = avaliacaoAvaliavel.avaliacao.id AND av1.nota = 1) " +
            "       LEFT OUTER JOIN Avaliacao av2 ON (av2.id = avaliacaoAvaliavel.avaliacao.id AND av2.nota = 2) " +
            "       LEFT OUTER JOIN Avaliacao av3 ON (av3.id = avaliacaoAvaliavel.avaliacao.id AND av3.nota = 3) " +
            "       LEFT OUTER JOIN Avaliacao av4 ON (av4.id = avaliacaoAvaliavel.avaliacao.id AND av4.nota = 4) " +
            "       LEFT OUTER JOIN Avaliacao av5 ON (av5.id = avaliacaoAvaliavel.avaliacao.id AND av5.nota = 5) " +
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
            "                   SELECT avaliavel.usuario.id FROM Avaliavel avaliavel WHERE " +
            "                   (" +
            "                       avaliavel.unidadeTipoAvaliacao.id = unidadeTipoAvaliacao.id AND avaliavel.unidadeTipoAvaliacao.unidade.id IN :unidadesFilter " +
            "                   )" +
            "               )" +
            "           )" +
            "           OR :unidadesFilter IS NULL" +
            "       )" +
            "       AND " +
            "       (" +
            "           (" +
            "               (:perfil != '" + Perfil.ADMINISTRADOR_VALUE + "' AND :perfil != '" + Perfil.ROOT_VALUE + "') " +
            "               AND " +
            "               (" +
            "                   unidade.id IN " +
            "                   (" +
            "                       SELECT avaliavel.unidadeTipoAvaliacao.unidade.id FROM Avaliavel avaliavel WHERE " +
            "                       (" +
            "                           avaliavel.unidadeTipoAvaliacao.unidade.id IN " +
            "                           (" +
            "                               SELECT operador.unidade.id FROM Operador operador WHERE " +
            "                               (" +
            "                                   operador.usuario.id = :usuarioId " +
            "                               )" +
            "                           )" +
            "                       )" +
            "                   )" +
            "                   OR operador.unidade.id IN " +
            "                   (" +
            "                       SELECT operadorInner.unidade.id FROM Operador operadorInner WHERE operadorInner.usuario.id = :usuarioId " +
            "                   ) " +
            "               )" +
            "           )" +
            "           OR (:perfil = '" + Perfil.ADMINISTRADOR_VALUE + "' OR :perfil = '" + Perfil.ROOT_VALUE + "')" +
            "       )" +
            "   )" +
            "GROUP BY usuario.id, usuario.nome, usuario.thumbnailPath, usuario.avatarPath, usuario.fotoPath"
    )
    Page<Usuario> listByFilters(
            @Param("usuarioId") final Long usuarioId,
            @Param("perfil") final String perfil,
            @Param("defaultFilter") final String defaultFilter,
            @Param("unidadesFilter") final List<Long> unidadesFilter,
            @Param("dataInicioFilter") final LocalDateTime dataInicioFilter,
            @Param("dataTerminoFilter") final LocalDateTime dataTerminoFilter,
            final Pageable pageable);

    /**
     *
     */
    @Query("SELECT new Usuario( " +
            "   usuario.id, " +
            "   usuario.nome, " +
            "   usuario.thumbnailPath, " +
            "   usuario.avatarPath, " +
            "   usuario.fotoPath, " +
            "   AVG(avaliacao.nota) AS media," +
//            "  (CASE WHEN AVG(avaliacao.nota) IS NULL THEN 0.0 ELSE AVG(avaliacao.nota) END) AS media," +
            "   COUNT(avaliacao) AS quantidadeAvaliacoes," +
            "   COUNT(av1) AS avaliacoes1," +
            "   COUNT(av2) AS avaliacoes2," +
            "   COUNT(av3) AS avaliacoes3," +
            "   COUNT(av4) AS avaliacoes4," +
            "   COUNT(av5) AS avaliacoes5," +
            "   usuario.conta" +
            ") FROM Usuario usuario " +
            "       LEFT OUTER JOIN Avaliavel avaliavel ON avaliavel.usuario.id = usuario.id " +
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
            "   AND :usuarioId = usuario.id) " +
            "GROUP BY usuario.id, usuario.nome, usuario.thumbnailPath, usuario.avatarPath, usuario.fotoPath"
    )
    Optional<Usuario> findUsuarioById(@Param("usuarioId") final Long usuarioId,
                                      @Param("dataInicioFilter") final LocalDateTime dataInicioFilter,
                                      @Param("dataTerminoFilter") final LocalDateTime dataTerminoFilter);

    /**
     *
     */
    @Query("SELECT new Usuario( " +
            "   usuario.id, " +
            "   usuario.nome, " +
            "   usuario.thumbnailPath,  " +
            "   usuario.avatarPath, " +
            "   usuario.fotoPath, " +
            "   AVG(CASE WHEN avaliacao.nota IS NULL THEN 0 ELSE avaliacao.nota END) AS media," +
            "   COUNT(avaliacao) AS quantidadeAvaliacoes," +
            "   COUNT(av1) AS avaliacoes1," +
            "   COUNT(av2) AS avaliacoes2," +
            "   COUNT(av3) AS avaliacoes3," +
            "   COUNT(av4) AS avaliacoes4," +
            "   COUNT(av5) AS avaliacoes5," +
            "   usuario.conta" +
            ") FROM Usuario usuario " +
            "       LEFT OUTER JOIN Avaliavel avaliavel ON avaliavel.usuario.id = usuario.id " +
            "       LEFT OUTER JOIN UnidadeTipoAvaliacao unidadeTipoAvaliacao ON unidadeTipoAvaliacao.id = avaliavel.unidadeTipoAvaliacao.id " +
            "       LEFT OUTER JOIN AvaliacaoAvaliavel avaliacaoAvaliavel ON avaliacaoAvaliavel.avaliavel.id = avaliavel.id AND avaliavel.unidadeTipoAvaliacao.id = unidadeTipoAvaliacao.id" +
            "       LEFT OUTER JOIN Avaliacao avaliacao ON avaliacao.id = avaliacaoAvaliavel.avaliacao.id " +
            "       LEFT OUTER JOIN Avaliacao av1 ON (av1.id = avaliacaoAvaliavel.avaliacao.id AND av1.nota = 1) " +
            "       LEFT OUTER JOIN Avaliacao av2 ON (av2.id = avaliacaoAvaliavel.avaliacao.id AND av2.nota = 2) " +
            "       LEFT OUTER JOIN Avaliacao av3 ON (av3.id = avaliacaoAvaliavel.avaliacao.id AND av3.nota = 3) " +
            "       LEFT OUTER JOIN Avaliacao av4 ON (av4.id = avaliacaoAvaliavel.avaliacao.id AND av4.nota = 4) " +
            "       LEFT OUTER JOIN Avaliacao av5 ON (av5.id = avaliacaoAvaliavel.avaliacao.id AND av5.nota = 5) " +
            "   WHERE " +
            "   ( " +
            "       usuario.id = :usuarioId" +
            "   )" +
            "GROUP BY usuario.id, usuario.nome, usuario.conta.email, usuario.thumbnailPath, usuario.avatarPath, usuario.fotoPath"
    )
    Usuario findUsuarioByIdAndReturnAvaliacoes(@Param("usuarioId") final Long usuarioId);

    /**
     * @param unidadeId Long
     * @return List<Usuario>
     */
    @Query("FROM Usuario usuario WHERE " +
            "           usuario.conta.administrador = TRUE " +
            "           OR usuario.id IN" +
            "           (" +
            "               SELECT operador.usuario.id FROM Operador operador WHERE " +
            "               (" +
            "                   operador.unidade.id = :unidadeId " +
            "               )" +
            "           )" +
            "           OR usuario.id IN" +
            "           (" +
            "               SELECT avaliavel.usuario.id FROM Avaliavel avaliavel WHERE " +
            "               (" +
            "                   avaliavel.unidadeTipoAvaliacao.unidade.id = :unidadeId" +
            "               )" +
            "           )"
    )
    List<Usuario> listUsuariosByUnidadeId(@Param("unidadeId") final Long unidadeId);

    /**
     * @return List<Usuario>
     */
    @Query("FROM Usuario usuario WHERE usuario.conta.administrador = TRUE")
    List<Usuario> getAdministrators();

    /**
     * @param nome String
     * @return List<Usuario>
     */
    List<Usuario> findByNome(final String nome);

}
