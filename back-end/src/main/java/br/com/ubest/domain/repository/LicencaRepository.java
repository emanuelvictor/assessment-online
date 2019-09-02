package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.unidade.Licenca;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LicencaRepository extends JpaRepository<Licenca, Long> {

    /**
     * TODO com pau
     *
     * @param usuarioId {long}
     * @return List<Licenca>
     */
    @Query("FROM Licenca licenca WHERE " +
            "   (   " +
            "       licenca.id IN (" +
            "           SELECT avaliavel.unidadeTipoAvaliacaoLicenca.licenca.id FROM Avaliavel avaliavel WHERE " +
            "           (" +
            "               avaliavel.usuario.id = :usuarioId" +
            "           )" +
            "       ) " +
            "       OR licenca.id IN (" +
            "           SELECT unidadeTipoAvaliacaoLicenca.licenca.id From UnidadeTipoAvaliacaoLicenca unidadeTipoAvaliacaoLicenca WHERE " +
            "           (" +
            "               unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao.unidade.id IN " +
            "               (" +
            "                   SELECT operador.unidade.id FROM Operador operador WHERE operador.usuario.id = :usuarioId" +
            "               )" +
            "           )" +
            "       ) " +
            "   )"
    )
    List<Licenca> listByUsuarioId(@Param("usuarioId") final long usuarioId);

    /**
     * @param licencaId {long}
     * @return List<String>
     */
    @Query("SELECT operador.usuario.conta.password FROM Operador operador WHERE" +
            "   ( " +
            "       operador.unidade.id IN " +
            "       (" +
            "           SELECT unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao.unidade.id FROM UnidadeTipoAvaliacaoLicenca unidadeTipoAvaliacaoLicenca WHERE " +
            "           (" +
            "               unidadeTipoAvaliacaoLicenca.licenca.id = :licencaId" +
            "           )" +
            "       )" +
            "   )"
    )
    List<String> getHashsByLicencaId(@Param("licencaId") final long licencaId);

    /**
     * @param usuarioId     {Long}
     * @param perfil        String
     * @param defaultFilter String
     * @param pageable      Pageable
     * @return Page<Unidade>
     */
    @Query(" FROM Licenca licenca " +
            "   WHERE " +
            "   (   " +
            "       (" +
            "           FILTER(:defaultFilter, licenca.nome, licenca.numero) = TRUE" +
            "       )" +
            "       AND (" +
            "           :tenant IS NOT NULL AND (:tenant = licenca.tenant)" +
            "           OR :tenant IS NULL" +
            "       )" +
//            "       AND" +
//            "       (" +
//            "           (:perfil != '" + Perfil.ADMINISTRADOR_VALUE + "' AND :perfil != '" + Perfil.ROOT_VALUE + "') AND licenca.id IN " +
//            "           (" +
//            "               SELECT operador.licenca.id FROM Operador operador WHERE " +
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
//           + "GROUP BY licenca.id, unidade.created, unidade.updated, unidade.documento, unidade.nome, unidade.documento, endereco.id, cidade.id, estado.id, pais.id"
    )
    Page<Licenca> listByFilters(
//            @Param("usuarioId") final Long usuarioId,
//                                @Param("perfil") final String perfil,
            @Param("defaultFilter") final String defaultFilter,
            @Param("tenant") final String tenant, // TODO vai para o filtro do hibernate
            final Pageable pageable);
}
