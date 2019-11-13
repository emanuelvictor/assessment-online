package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.unidade.Dispositivo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DispositivoRepository extends JpaRepository<Dispositivo, Long> {


    /**
     * @param numeroSerie
     * @return
     */
    Optional<Dispositivo> findByNumeroSerie(@Param("numeroSerie") final String numeroSerie);

    /**
     * @param numeroLicenca
     * @return
     */
    Optional<Dispositivo> findByNumeroLicenca(@Param("numeroLicenca") final Long numeroLicenca);

    /**
     * @param codigo
     * @return
     */
    Optional<Dispositivo> findByCodigo(@Param("codigo") final Long codigo);

    /**
     * @param usuarioId {long}
     * @return List<Dispositivo>
     */
    @Query("FROM Dispositivo dispositivo WHERE " +
            "   (   " +
            "       dispositivo.id IN (" +
            "           SELECT avaliavel.unidadeTipoAvaliacaoDispositivo.dispositivo.id FROM Avaliavel avaliavel WHERE " +
            "           (" +
            "               avaliavel.usuario.id = :usuarioId" +
            "           )" +
            "       ) " +
            "       OR dispositivo.id IN (" +
            "           SELECT unidadeTipoAvaliacaoDispositivo.dispositivo.id From UnidadeTipoAvaliacaoDispositivo unidadeTipoAvaliacaoDispositivo WHERE " +
            "           (" +
            "               unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade.id IN " +
            "               (" +
            "                   SELECT operador.unidade.id FROM Operador operador WHERE operador.usuario.id = :usuarioId" +
            "               )" +
            "           )" +
            "       ) " +
            "   )"
    )
    List<Dispositivo> listByUsuarioId(@Param("usuarioId") final long usuarioId);

    /**
     * @param dispositivoId {long}
     * @return List<String>
     */
    @Deprecated
    @Query("SELECT operador.usuario.conta.password FROM Operador operador WHERE" +
            "   ( " +
            "       operador.unidade.id IN " +
            "       (" +
            "           SELECT unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade.id FROM UnidadeTipoAvaliacaoDispositivo unidadeTipoAvaliacaoDispositivo WHERE " +
            "           (" +
            "               unidadeTipoAvaliacaoDispositivo.dispositivo.id = :dispositivoId" +
            "           )" +
            "       )" +
            "   )"
    )
    List<String> getHashsByDispositivoId(@Param("dispositivoId") final long dispositivoId);

    /**
     * @param defaultFilter
     * @param tenant
     * @param pageable
     * @return
     */
    @Query(" FROM Dispositivo dispositivo " +
            "   WHERE " +
            "   (   " +
            "       (" +
            "           FILTER(:defaultFilter, dispositivo.nome, dispositivo.numeroLicenca) = TRUE" +
            "       )" +
            "       AND (" +
            "           :tenant IS NOT NULL AND (:tenant = dispositivo.tenant)" +
            "           OR :tenant IS NULL" +
            "       )" +
//            "       AND" +
//            "       (" +
//            "           (:perfil != '" + Perfil.ADMINISTRADOR_VALUE + "' AND :perfil != '" + Perfil.ROOT_VALUE + "') AND dispositivo.id IN " +
//            "           (" +
//            "               SELECT operador.dispositivo.id FROM Operador operador WHERE " +
//            "               (" +
//            "                   operador.usuario.id = :usuarioId" +
//            "                   AND " +
//            "                   (" +
//            "                       (" +
//            "                           :perfil = '" + Perfil.ATENDENTE_VALUE + "'  " +
//            "                       )" +
//            "                       OR " +
//            "                       (" +
//            "                           :perfil = '" + Perfil.OPERADOR_VALUE + "' " +
//            "                       )" +
//            "                   )" +
//            "               )" +
//            "           ) OR (:perfil = '" + Perfil.ADMINISTRADOR_VALUE + "' OR :perfil = '" + Perfil.ROOT_VALUE + "')" +
//            "       )" +
            "   )"
//           + "GROUP BY dispositivo.id, unidade.created, unidade.updated, unidade.documento, unidade.nome, unidade.documento, endereco.id, cidade.id, estado.id, pais.id"
    )
    Page<Dispositivo> listByFilters(
//            @Param("usuarioId") final Long usuarioId,
//                                @Param("perfil") final String perfil,
            @Param("defaultFilter") final String defaultFilter,
            @Param("tenant") final String tenant, // TODO vai para o filtro do hibernate
            final Pageable pageable);

}
