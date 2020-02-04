package online.meavalia.domain.repository;

import online.meavalia.domain.entity.usuario.Perfil;
import online.meavalia.domain.entity.usuario.Usuario;
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
     * @param usuarioId
     * @param perfil
     * @param defaultFilter
     * @param idsFilter
     * @param pageable
     * @return
     */
    @Query("SELECT new Usuario( " +
            "   usuario.id, " +
            "   usuario.nome, " +
            "   usuario.thumbnailPath,  " +
            "   usuario.avatarPath, " +
            "   usuario.fotoPath, " +
            "   usuario.conta," +
            "   usuario.documento" +
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
            "               usuario.id IN :idsFilter" +
            "           ) OR :idsFilter IS NULL" +
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
            "GROUP BY usuario.id, usuario.nome, usuario.conta.email, usuario.thumbnailPath, usuario.avatarPath, usuario.fotoPath, usuario.documento"
    )
    Page<Usuario> listByFilters(
            @Param("usuarioId") final Long usuarioId,
            @Param("perfil") final String perfil,
            @Param("defaultFilter") final String defaultFilter,
            @Param("idsFilter") final List<Long> idsFilter,
            final Pageable pageable);

    /**
     * @param usuarioId
     * @param perfil
     * @param defaultFilter
     * @param tiposAvaliacoesFilter
     * @param unidadesFilter
     * @param dataInicioFilter
     * @param dataTerminoFilter
     * @param pageable
     * @return
     */
    @Query("SELECT new Usuario( " +
            "   usuario.id, " +
            "   usuario.nome, " +
            "   usuario.thumbnailPath, " +
            "   usuario.avatarPath, " +
            "   usuario.fotoPath, " +
            "   AVG(avaliacao.nota) AS media," +
//            "  (CASE WHEN AVG(avaliacao.nota) IS NULL THEN 0.0 ELSE AVG(avaliacao.nota) END) AS media," +
            "   COUNT(avaliacao.id) AS quantidadeAvaliacoes," +
            "   COUNT(av1.id) AS avaliacoes1," +
            "   COUNT(av2.id) AS avaliacoes2," +
            "   COUNT(av3.id) AS avaliacoes3," +
            "   COUNT(av4.id) AS avaliacoes4," +
            "   COUNT(av5.id) AS avaliacoes5," +
            "   usuario.conta," +
            "   usuario.documento" +
            ") FROM Usuario usuario " +
            "       LEFT OUTER JOIN Operador operador ON operador.usuario.id = usuario.id " +
            "       LEFT OUTER JOIN Avaliavel avaliavel ON avaliavel.usuario.id = usuario.id " +
            "       LEFT OUTER JOIN UnidadeTipoAvaliacaoDispositivo unidadeTipoAvaliacaoDispositivo ON unidadeTipoAvaliacaoDispositivo.id = avaliavel.unidadeTipoAvaliacaoDispositivo.id " +
            "       LEFT OUTER JOIN UnidadeTipoAvaliacao unidadeTipoAvaliacao ON unidadeTipoAvaliacao.id = unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.id " +
            "       LEFT OUTER JOIN Unidade unidade ON unidade.id = unidadeTipoAvaliacao.unidade.id " +
            "       LEFT OUTER JOIN AvaliacaoAvaliavel avaliacaoAvaliavel ON avaliacaoAvaliavel.avaliavel.id = avaliavel.id " +
            "       LEFT OUTER JOIN Avaliacao avaliacao ON (avaliacao.id = avaliacaoAvaliavel.avaliacao.id) " +
            "       LEFT OUTER JOIN Agrupador agrupador ON (agrupador.id = avaliacao.agrupador.id) " +
            "       LEFT OUTER JOIN Avaliacao av1 ON (av1.id = avaliacao.id AND av1.nota = 1 ) " +
            "       LEFT OUTER JOIN Avaliacao av2 ON (av2.id = avaliacao.id AND av2.nota = 2 ) " +
            "       LEFT OUTER JOIN Avaliacao av3 ON (av3.id = avaliacao.id AND av3.nota = 3 ) " +
            "       LEFT OUTER JOIN Avaliacao av4 ON (av4.id = avaliacao.id AND av4.nota = 4 ) " +
            "       LEFT OUTER JOIN Avaliacao av5 ON (av5.id = avaliacao.id AND av5.nota = 5 ) " +
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
            "                       avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.tipoAvaliacao.id = unidadeTipoAvaliacao.tipoAvaliacao.id AND avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.tipoAvaliacao.id IN :tiposAvaliacoesFilter " +
            "                   )" +
            "               )" +
            "           )" +
            "           OR :tiposAvaliacoesFilter IS NULL" +
            "       )" +
            "       AND " +
            "       (" +
            "           (" +
            "               usuario.id IN " +
            "               (" +
            "                   SELECT avaliavel.usuario.id FROM Avaliavel avaliavel WHERE " +
            "                   (" +
            "                       avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.id = unidadeTipoAvaliacao.id AND avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade.id IN :unidadesFilter " +
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
            "                       SELECT avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade.id FROM Avaliavel avaliavel WHERE " +
            "                       (" +
            "                           avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade.id IN " +
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
            "GROUP BY usuario.id, usuario.nome, usuario.thumbnailPath, usuario.avatarPath, usuario.fotoPath, usuario.documento"
    )
    Page<Usuario> listByFilters(
            @Param("usuarioId") final Long usuarioId,
            @Param("perfil") final String perfil,
            @Param("defaultFilter") final String defaultFilter,
            @Param("tiposAvaliacoesFilter") final List<Long> tiposAvaliacoesFilter,
            @Param("unidadesFilter") final List<Long> unidadesFilter,
            @Param("dataInicioFilter") final LocalDateTime dataInicioFilter,
            @Param("dataTerminoFilter") final LocalDateTime dataTerminoFilter,
            final Pageable pageable);

    /**
     * @param usuarioId
     * @param dataInicioFilter
     * @param dataTerminoFilter
     * @return
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
            "   usuario.conta," +
            "   usuario.documento" +
            ") FROM Usuario usuario " +
            "       LEFT OUTER JOIN Avaliavel avaliavel ON avaliavel.usuario.id = usuario.id " +
            "       LEFT OUTER JOIN AvaliacaoAvaliavel avaliacaoAvaliavel ON avaliacaoAvaliavel.avaliavel.id = avaliavel.id " +
            "       LEFT OUTER JOIN Avaliacao avaliacao ON (avaliacao.id = avaliacaoAvaliavel.avaliacao.id) " +
            "       LEFT OUTER JOIN Agrupador agrupador ON (agrupador.id = avaliacao.agrupador.id) " +
            "       LEFT OUTER JOIN Avaliacao av1 ON (av1.id = avaliacao.id AND av1.nota = 1 ) " +
            "       LEFT OUTER JOIN Avaliacao av2 ON (av2.id = avaliacao.id AND av2.nota = 2 ) " +
            "       LEFT OUTER JOIN Avaliacao av3 ON (av3.id = avaliacao.id AND av3.nota = 3 ) " +
            "       LEFT OUTER JOIN Avaliacao av4 ON (av4.id = avaliacao.id AND av4.nota = 4 ) " +
            "       LEFT OUTER JOIN Avaliacao av5 ON (av5.id = avaliacao.id AND av5.nota = 5 ) " +
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
            "GROUP BY usuario.id, usuario.nome, usuario.thumbnailPath, usuario.avatarPath, usuario.fotoPath, usuario.documento"
    )
    Optional<Usuario> findUsuarioById(@Param("usuarioId") final Long usuarioId,
                                      @Param("dataInicioFilter") final LocalDateTime dataInicioFilter,
                                      @Param("dataTerminoFilter") final LocalDateTime dataTerminoFilter);

    /**
     * @param usuarioId
     * @return
     */
    @Query("SELECT new Usuario( " +
            "   usuario.id, " +
            "   usuario.nome, " +
            "   usuario.thumbnailPath,  " +
            "   usuario.avatarPath, " +
            "   usuario.fotoPath, " +
            "   AVG(avaliacao.nota) AS media," +
            "   COUNT(avaliacao) AS quantidadeAvaliacoes," +
            "   COUNT(av1) AS avaliacoes1," +
            "   COUNT(av2) AS avaliacoes2," +
            "   COUNT(av3) AS avaliacoes3," +
            "   COUNT(av4) AS avaliacoes4," +
            "   COUNT(av5) AS avaliacoes5," +
            "   usuario.conta," +
            "   usuario.documento" +
            ") FROM Usuario usuario " +
            "       LEFT OUTER JOIN Avaliavel avaliavel ON avaliavel.usuario.id = usuario.id " +
            "       LEFT OUTER JOIN UnidadeTipoAvaliacaoDispositivo unidadeTipoAvaliacaoDispositivo ON unidadeTipoAvaliacaoDispositivo.id = avaliavel.unidadeTipoAvaliacaoDispositivo.id " +
            "       LEFT OUTER JOIN UnidadeTipoAvaliacao unidadeTipoAvaliacao ON unidadeTipoAvaliacao.id = unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.id " +
            "       LEFT OUTER JOIN AvaliacaoAvaliavel avaliacaoAvaliavel ON avaliacaoAvaliavel.avaliavel.id = avaliavel.id AND avaliavel.unidadeTipoAvaliacaoDispositivo.id = unidadeTipoAvaliacaoDispositivo.id" +
            "       LEFT OUTER JOIN Avaliacao avaliacao ON (avaliacao.id = avaliacaoAvaliavel.avaliacao.id) " +
            "       LEFT OUTER JOIN Agrupador agrupador ON (agrupador.id = avaliacao.agrupador.id) " +
            "       LEFT OUTER JOIN Avaliacao av1 ON (av1.id = avaliacao.id AND av1.nota = 1 ) " +
            "       LEFT OUTER JOIN Avaliacao av2 ON (av2.id = avaliacao.id AND av2.nota = 2 ) " +
            "       LEFT OUTER JOIN Avaliacao av3 ON (av3.id = avaliacao.id AND av3.nota = 3 ) " +
            "       LEFT OUTER JOIN Avaliacao av4 ON (av4.id = avaliacao.id AND av4.nota = 4 ) " +
            "       LEFT OUTER JOIN Avaliacao av5 ON (av5.id = avaliacao.id AND av5.nota = 5 ) " +
            "   WHERE " +
            "   ( " +
            "       usuario.id = :usuarioId" +
            "   )" +
            "GROUP BY usuario.id, usuario.nome, usuario.conta.email, usuario.thumbnailPath, usuario.avatarPath, usuario.fotoPath, usuario.documento"
    )
    Usuario findUsuarioByIdAndReturnAvaliacoes(@Param("usuarioId") final Long usuarioId);

//    /**
//     * @return List<Usuario>
//     */
//    @Query("FROM Usuario usuario WHERE usuario.conta.administrador = TRUE")
//    List<Usuario> getAdministrators();

    /**
     * @param nome String
     * @return List<Usuario>
     */
    @Deprecated
    List<Usuario> findByNome(final String nome);

//    /**
//     * @param dispositivoId Long
//     * @return List<Usuario>
//     */
//    @Query("FROM Usuario usuario WHERE " +
//            "           usuario.conta.administrador = TRUE " +
//            "           OR usuario.id IN" +
//            "           (" +
//            "               SELECT operador.usuario.id FROM Operador operador WHERE " +
//            "               (" +
//            "                   operador.unidade.id IN " +
//            "                   (" +
//            "                       SELECT unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade.id FROM UnidadeTipoAvaliacaoDispositivo unidadeTipoAvaliacaoDispositivo WHERE unidadeTipoAvaliacaoDispositivo.dispositivo.id = :dispositivoId" +
//            "                   ) " +
//            "               )" +
//            "           )" +
//            "           OR usuario.id IN" +
//            "           (" +
//            "               SELECT avaliavel.usuario.id FROM Avaliavel avaliavel WHERE " +
//            "               (" +
//            "                   avaliavel.unidadeTipoAvaliacaoDispositivo.dispositivo.id = :dispositivoId" +
//            "               )" +
//            "           )"
//    )
//    List<Usuario> listUsuariosByDispositivoId(@Param("dispositivoId") final Long dispositivoId);

}
