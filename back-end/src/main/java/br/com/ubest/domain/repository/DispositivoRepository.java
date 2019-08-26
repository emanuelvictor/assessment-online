package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.unidade.Dispositivo;
import br.com.ubest.domain.entity.unidade.Unidade;
import br.com.ubest.domain.entity.usuario.Perfil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DispositivoRepository extends JpaRepository<Dispositivo, Long> {

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
            "       OR " +
            "       dispositivo.id IN (" +
            "           SELECT operador.dispositivo.id FROM Operador operador WHERE " +
            "           (" +
            "               operador.usuario.id = :usuarioId" +
            "           )" +
            "       ) " +
            "   )"
    )
    List<Dispositivo> listByUsuarioId(@Param("usuarioId") final long usuarioId);

    /**
     * @param dispositivoId {long}
     * @return List<String>
     */
    @Query("SELECT operador.usuario.conta.password FROM Operador operador " +
            "   WHERE" +
            "   ( " +
            "       operador.dispositivo.id = :dispositivoId " +
            "   )"
    )
    List<String> getHashsByDispositivoId(@Param("dispositivoId") final long dispositivoId);

//    /**
//     * @param usuarioId     {Long}
//     * @param perfil        String
//     * @param defaultFilter String
//     * @param pageable      Pageable
//     * @return Page<Unidade>
//     */
//    @Query(" FROM Dispositivo dispositivo " +
//            "       LEFT OUTER JOIN Endereco endereco ON  .endereco.id = endereco.id " +
//            "       LEFT OUTER JOIN Cidade cidade ON cidade.id = endereco.cidade.id " +
//            "       LEFT OUTER JOIN Estado estado ON estado.id = cidade.estado.id " +
//            "       LEFT OUTER JOIN Pais pais ON pais.id = estado.pais.id " +
//            "   WHERE " +
//            "   (   " +
//            "       (" +
//            "           FILTER(:defaultFilter, dispositivo.nome, endereco.logradouro, endereco.complemento, endereco.bairro, endereco.cep, endereco.numero, cidade.nome, estado.nome, estado.uf, pais.nome) = TRUE" +
//            "       )" +
//            "       AND" +
//            "       (" +
//            "           :withBondFilter IS NOT NULL AND :withBondFilter IS TRUE AND " +
//            "           (" +
//            "               dispositivo.id IN (SELECT unidadeTipoAvaliacaoDispositivo.dispositivo.id FROM UnidadeTipoAvaliacaoDispositivo unidadeTipoAvaliacaoDispositivo " +
//            "                   WHERE" +
//            "                   (" +
//            "                       unidadeTipoAvaliacaoDispositivo.dispositivo.id = dispositivo.id AND unidadeTipoAvaliacaoDispositivo.ativo = :withBondFilter" +
//            "                   )" +
//            "               )" +
//            "           )" +
//            "           OR :withBondFilter IS NULL " +
//            "       )" +
//            "       AND" +
//            "       (" +
//            "           :withAvaliaveisFilter IS NOT NULL AND :withAvaliaveisFilter IS TRUE AND " +
//            "           (" +
//            "               dispositivo.id IN (SELECT unidadeTipoAvaliacaoDispositivo.dispositivo.id FROM UnidadeTipoAvaliacaoDispositivo unidadeTipoAvaliacaoDispositivo " +
//            "                   WHERE" +
//            "                   (" +
//            "                       unidadeTipoAvaliacaoDispositivo.dispositivo.id = dispositivo.id AND unidadeTipoAvaliacao.id IN (SELECT avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.id FROM Avaliavel avaliavel WHERE (avaliavel.unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.id = unidadeTipoAvaliacao.id AND avaliavel.ativo IS TRUE))" +
//            "                   )" +
//            "               )" +
//            "           )" +
//            "           OR :withAvaliaveisFilter IS NULL " +
//            "       )" +
//            "       AND" +
//            "       (" +
//            "           :withUnidadesTiposAvaliacoesAtivasFilter IS NOT NULL AND " +
//            "           (" +
//            "               dispositivo.id IN (SELECT unidadeTipoAvaliacaoDispositivo.dispositivo.id FROM UnidadeTipoAvaliacaoDispositivo unidadeTipoAvaliacaoDispositivo " +
//            "                           INNER JOIN UnidadeTipoAvaliacao unidadeTipoAvaliacao ON unidadeTipoAvaliacao.id = unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.id" +
//            "                   WHERE" +
//            "                   (" +
//            "                       unidadeTipoAvaliacaoDispositivo.dispositivo.id = dispositivo.id AND unidadeTipoAvaliacao.ativo = :withUnidadesTiposAvaliacoesAtivasFilter " +
//            "                   )" +
//            "               )" +
//            "           )" +
//            "           OR :withUnidadesTiposAvaliacoesAtivasFilter IS NULL " +
//            "       )" +
//            "       AND" +
//            "       (" +
//            "           (" +
//            "               dispositivo.id IN :idsFilter" +
//            "           ) OR :idsFilter IS NULL" +
//            "       )" +
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
//            "   )"
////           + "GROUP BY dispositivo.id, unidade.created, unidade.updated, unidade.documento, unidade.nome, unidade.documento, endereco.id, cidade.id, estado.id, pais.id"
//    )
//    Page<Dispositivo> listByFilters(@Param("usuarioId") final Long usuarioId,
//                                @Param("perfil") final String perfil,
//                                @Param("defaultFilter") final String defaultFilter,
//                                @Param("withBondFilter") final Boolean withBondFilter,
//                                @Param("withAvaliaveisFilter") final Boolean withAvaliaveisFilter,
//                                @Param("withUnidadesTiposAvaliacoesAtivasFilter") final Boolean withUnidadesTiposAvaliacoesAtivasFilter,
//                                @Param("idsFilter") final List<Long> idsFilter,
//                                final Pageable pageable);
}
