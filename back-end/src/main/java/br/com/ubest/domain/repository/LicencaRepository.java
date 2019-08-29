package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.unidade.Licenca;
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

//    /**
//     * @param usuarioId     {Long}
//     * @param perfil        String
//     * @param defaultFilter String
//     * @param pageable      Pageable
//     * @return Page<Unidade>
//     */
//    @Query(" FROM Licenca licenca " +
//            "       LEFT OUTER JOIN Endereco endereco ON  .endereco.id = endereco.id " +
//            "       LEFT OUTER JOIN Cidade cidade ON cidade.id = endereco.cidade.id " +
//            "       LEFT OUTER JOIN Estado estado ON estado.id = cidade.estado.id " +
//            "       LEFT OUTER JOIN Pais pais ON pais.id = estado.pais.id " +
//            "   WHERE " +
//            "   (   " +
//            "       (" +
//            "           FILTER(:defaultFilter, licenca.nome, endereco.logradouro, endereco.complemento, endereco.bairro, endereco.cep, endereco.numero, cidade.nome, estado.nome, estado.uf, pais.nome) = TRUE" +
//            "       )" +
//            "       AND" +
//            "       (" +
//            "           :withBondFilter IS NOT NULL AND :withBondFilter IS TRUE AND " +
//            "           (" +
//            "               licenca.id IN (SELECT unidadeTipoAvaliacaoLicenca.licenca.id FROM UnidadeTipoAvaliacaoLicenca unidadeTipoAvaliacaoLicenca " +
//            "                   WHERE" +
//            "                   (" +
//            "                       unidadeTipoAvaliacaoLicenca.licenca.id = licenca.id AND unidadeTipoAvaliacaoLicenca.ativo = :withBondFilter" +
//            "                   )" +
//            "               )" +
//            "           )" +
//            "           OR :withBondFilter IS NULL " +
//            "       )" +
//            "       AND" +
//            "       (" +
//            "           :withAvaliaveisFilter IS NOT NULL AND :withAvaliaveisFilter IS TRUE AND " +
//            "           (" +
//            "               licenca.id IN (SELECT unidadeTipoAvaliacaoLicenca.licenca.id FROM UnidadeTipoAvaliacaoLicenca unidadeTipoAvaliacaoLicenca " +
//            "                   WHERE" +
//            "                   (" +
//            "                       unidadeTipoAvaliacaoLicenca.licenca.id = licenca.id AND unidadeTipoAvaliacao.id IN (SELECT avaliavel.unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao.id FROM Avaliavel avaliavel WHERE (avaliavel.unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao.id = unidadeTipoAvaliacao.id AND avaliavel.ativo IS TRUE))" +
//            "                   )" +
//            "               )" +
//            "           )" +
//            "           OR :withAvaliaveisFilter IS NULL " +
//            "       )" +
//            "       AND" +
//            "       (" +
//            "           :withUnidadesTiposAvaliacoesAtivasFilter IS NOT NULL AND " +
//            "           (" +
//            "               licenca.id IN (SELECT unidadeTipoAvaliacaoLicenca.licenca.id FROM UnidadeTipoAvaliacaoLicenca unidadeTipoAvaliacaoLicenca " +
//            "                           INNER JOIN UnidadeTipoAvaliacao unidadeTipoAvaliacao ON unidadeTipoAvaliacao.id = unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao.id" +
//            "                   WHERE" +
//            "                   (" +
//            "                       unidadeTipoAvaliacaoLicenca.licenca.id = licenca.id AND unidadeTipoAvaliacao.ativo = :withUnidadesTiposAvaliacoesAtivasFilter " +
//            "                   )" +
//            "               )" +
//            "           )" +
//            "           OR :withUnidadesTiposAvaliacoesAtivasFilter IS NULL " +
//            "       )" +
//            "       AND" +
//            "       (" +
//            "           (" +
//            "               licenca.id IN :idsFilter" +
//            "           ) OR :idsFilter IS NULL" +
//            "       )" +
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
//            "   )"
////           + "GROUP BY licenca.id, unidade.created, unidade.updated, unidade.documento, unidade.nome, unidade.documento, endereco.id, cidade.id, estado.id, pais.id"
//    )
//    Page<Licenca> listByFilters(@Param("usuarioId") final Long usuarioId,
//                                @Param("perfil") final String perfil,
//                                @Param("defaultFilter") final String defaultFilter,
//                                @Param("withBondFilter") final Boolean withBondFilter,
//                                @Param("withAvaliaveisFilter") final Boolean withAvaliaveisFilter,
//                                @Param("withUnidadesTiposAvaliacoesAtivasFilter") final Boolean withUnidadesTiposAvaliacoesAtivasFilter,
//                                @Param("idsFilter") final List<Long> idsFilter,
//                                final Pageable pageable);
}
