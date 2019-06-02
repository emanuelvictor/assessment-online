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
     * @param usuarioId         {Long}
     * @param perfil            String
     * @param defaultFilter     String
     * @param enderecoFilter    String
     * @param dataInicioFilter  LocalDateTime
     * @param dataTerminoFilter LocalDateTime
     * @param pageable          Pageable
     * @return Page<Unidade>
     */
    @Query("SELECT new Unidade( " +
            "   unidade.id, " +
            "   unidade.nome, " +
            "   unidade.documento, " +
            "   endereco," +
            "   AVG(avaliacao.nota) AS media," +
            "   COUNT(DISTINCT avaliacao.id) AS quantidadeAvaliacoes," +
            "   COUNT(DISTINCT av1.id) AS avaliacoes1," +
            "   COUNT(DISTINCT av2.id) AS avaliacoes2," +
            "   COUNT(DISTINCT av3.id) AS avaliacoes3," +
            "   COUNT(DISTINCT av4.id) AS avaliacoes4," +
            "   COUNT(DISTINCT av5.id) AS avaliacoes5" +
            ") FROM Unidade unidade " +
            "       LEFT OUTER JOIN Endereco endereco ON unidade.endereco.id = endereco.id " +
            "       LEFT OUTER JOIN Cidade cidade ON cidade.id = endereco.cidade.id " +
            "       LEFT OUTER JOIN Estado estado ON estado.id = cidade.estado.id " +
            "       LEFT OUTER JOIN Pais pais ON pais.id = estado.pais.id " +
            "       LEFT OUTER JOIN UnidadeTipoAvaliacao unidadeTipoAvaliacao ON unidadeTipoAvaliacao.unidade.id = unidade.id " +
            "       LEFT OUTER JOIN TipoAvaliacao tipoAvaliacao ON tipoAvaliacao.id = unidadeTipoAvaliacao.tipoAvaliacao.id " +
            "       LEFT OUTER JOIN Avaliavel avaliavel ON avaliavel.unidadeTipoAvaliacao.id = unidadeTipoAvaliacao.id " +
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
            "           FILTER(:defaultFilter, unidade.nome, endereco.logradouro,endereco.complemento,endereco.bairro, endereco.cep,endereco.numero,cidade.nome,estado.nome,estado.uf,pais.nome) = TRUE" +
            "       )" +
            "       AND " +
            "       (" +
            "           FILTER(:enderecoFilter, endereco.logradouro,endereco.complemento,endereco.bairro, endereco.cep,endereco.numero,cidade.nome,estado.nome,estado.uf,pais.nome) = TRUE" +
            "       )" +
            "       AND " +
            "       (" +
            "           tipoAvaliacao.id IN :tiposAvaliacoesFilter" +
            "           OR :tiposAvaliacoesFilter IS NULL" +
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
            "GROUP BY unidade.id, unidade.nome, unidade.documento, endereco.id, cidade.id, estado.id, pais.id"
    )
    Page<Unidade> listByFilters(@Param("usuarioId") final Long usuarioId,
                                @Param("perfil") final String perfil,
                                @Param("defaultFilter") final String defaultFilter,
                                @Param("tiposAvaliacoesFilter") final List<Long> tiposAvaliacoesFilter,
                                @Param("enderecoFilter") final String enderecoFilter,
                                @Param("dataInicioFilter") final LocalDateTime dataInicioFilter,
                                @Param("dataTerminoFilter") final LocalDateTime dataTerminoFilter,
                                final Pageable pageable);

    /**
     * @param usuarioId     {Long}
     * @param perfil        String
     * @param defaultFilter String
     * @param pageable      Pageable
     * @return Page<Unidade>
     */
    @Query("SELECT new Unidade(" +
            "   unidade.id, " +
            "   unidade.nome, " +
            "   unidade.documento, " +
            "   endereco" +
            ") FROM Unidade unidade " +
            "       LEFT OUTER JOIN Endereco endereco ON unidade.endereco.id = endereco.id " +
            "       LEFT OUTER JOIN Cidade cidade ON cidade.id = endereco.cidade.id " +
            "       LEFT OUTER JOIN Estado estado ON estado.id = cidade.estado.id " +
            "       LEFT OUTER JOIN Pais pais ON pais.id = estado.pais.id " +
            "   WHERE " +
            "   (   " +
            "       (" +
            "           FILTER(:defaultFilter, unidade.nome, endereco.logradouro, endereco.complemento, endereco.bairro, endereco.cep, endereco.numero, cidade.nome, estado.nome, estado.uf, pais.nome) = TRUE" +
            "       )" +
            "       AND" +
            "       (" +
            "           :withBondFilter IS NOT NULL AND :withBondFilter IS TRUE AND " +
            "           (" +
            "               unidade.id IN (SELECT unidadeTipoAvaliacao.unidade.id FROM UnidadeTipoAvaliacao unidadeTipoAvaliacao " +
            "                   WHERE" +
            "                   (" +
            "                       unidadeTipoAvaliacao.unidade.id = unidade.id AND unidadeTipoAvaliacao.ativo = :withBondFilter" +
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
            "                       unidadeTipoAvaliacao.unidade.id = unidade.id AND unidadeTipoAvaliacao.id IN (SELECT avaliavel.unidadeTipoAvaliacao.id FROM Avaliavel avaliavel WHERE (avaliavel.unidadeTipoAvaliacao.id = unidadeTipoAvaliacao.id AND avaliavel.ativo IS TRUE))" +
            "                   )" +
            "               )" +
            "           )" +
            "           OR :withAvaliaveisFilter IS NULL " +
            "       )" +
            "       AND" +
            "       (" +
            "           (:perfil != '" + Perfil.ADMINISTRADOR_VALUE + "' AND :perfil != '" + Perfil.ROOT_VALUE + "') AND unidade.id IN " +
            "           (" +
            "               SELECT operador.unidade.id FROM Operador operador WHERE " +
            "               (" +
            "                   operador.usuario.id = :usuarioId" +
            "                   AND " +
            "                   (" +
            "                       (" +
            "                           :perfil = '" + Perfil.ATENDENTE_VALUE + "'  " +
            "                       )" +
            "                       OR " +
            "                       (" +
            "                           :perfil = '" + Perfil.OPERADOR_VALUE + "' " +
            "                       )" +
            "                   )" +
            "               )" +
            "           ) OR (:perfil = '" + Perfil.ADMINISTRADOR_VALUE + "' OR :perfil = '" + Perfil.ROOT_VALUE + "')" +
            "       )" +
            "   )"
//           + "GROUP BY unidade.id, unidade.created, unidade.updated, unidade.documento, unidade.nome, unidade.documento, endereco.id, cidade.id, estado.id, pais.id"
    )
    Page<Unidade> listByFilters(@Param("usuarioId") final Long usuarioId,
                                @Param("perfil") final String perfil,
                                @Param("defaultFilter") final String defaultFilter,
                                @Param("withBondFilter") final Boolean withBondFilter,
                                @Param("withAvaliaveisFilter") final Boolean withAvaliaveisFilter,
                                final Pageable pageable);

    /**
     *
     */
    @Query("SELECT new Unidade( " +
            "   unidade.id, " +
            "   unidade.nome, " +
            "   unidade.documento, " +
            "   endereco," +
            "   AVG(avaliacao.nota) AS media," +
            "   COUNT(avaliacao.id) AS quantidadeAvaliacoes," +
            "   COUNT(av1.id) AS avaliacoes1," +
            "   COUNT(av2.id) AS avaliacoes2," +
            "   COUNT(av3.id) AS avaliacoes3," +
            "   COUNT(av4.id) AS avaliacoes4," +
            "   COUNT(av5.id) AS avaliacoes5" +
            ") FROM Unidade unidade " +
            "       LEFT OUTER JOIN Endereco endereco ON unidade.endereco.id = endereco.id " +
            "       LEFT OUTER JOIN UnidadeTipoAvaliacao unidadeTipoAvaliacao ON unidadeTipoAvaliacao.unidade.id = unidade.id " +
            "       LEFT OUTER JOIN Avaliavel avaliavel ON avaliavel.unidadeTipoAvaliacao.id = unidadeTipoAvaliacao.id " +
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
            "GROUP BY unidade.id, unidade.documento, unidade.nome, endereco.id"
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
            "   unidade.documento, " +
            "   endereco," +
            "   AVG(CASE WHEN avaliacao.nota IS NULL THEN 0 ELSE avaliacao.nota END) AS media," +
            "   COUNT(avaliacao) AS quantidadeAvaliacoes," +
            "   COUNT(av1) AS avaliacoes1," +
            "   COUNT(av2) AS avaliacoes2," +
            "   COUNT(av3) AS avaliacoes3," +
            "   COUNT(av4) AS avaliacoes4," +
            "   COUNT(av5) AS avaliacoes5" +
            ") FROM Unidade unidade " +
            "       LEFT OUTER JOIN Endereco endereco ON unidade.endereco.id = endereco.id " +
            "       LEFT OUTER JOIN UnidadeTipoAvaliacao unidadeTipoAvaliacao ON unidadeTipoAvaliacao.unidade.id = unidade.id " +
            "       LEFT OUTER JOIN Avaliavel avaliavel ON avaliavel.unidadeTipoAvaliacao.id = unidadeTipoAvaliacao.id " +
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
            "GROUP BY unidade.id, unidade.nome, unidade.documento, endereco.id"
    )
    Unidade findUnidadeByIdAndReturnAvaliacoes(@Param("unidadeId") final Long unidadeId);

    /**
     * @param usuarioId {long}
     * @return List<Unidade>
     */
    @Query("FROM Unidade unidade WHERE " +
            "   (   " +
            "       unidade.id IN (" +
            "           SELECT avaliavel.unidadeTipoAvaliacao.unidade.id FROM Avaliavel avaliavel WHERE " +
            "           (" +
            "               avaliavel.usuario.id = :usuarioId" +
            "           )" +
            "       ) " +
            "       OR " +
            "       unidade.id IN (" +
            "           SELECT operador.unidade.id FROM Operador operador WHERE " +
            "           (" +
            "               operador.usuario.id = :usuarioId" +
            "           )" +
            "       ) " +
            "   )"
    )
    List<Unidade> listByUsuarioId(@Param("usuarioId") final long usuarioId);

    /**
     * @param unidadeId {long}
     * @return List<String>
     */
    @Query("SELECT operador.usuario.conta.password FROM Operador operador " +
            "   WHERE" +
            "   ( " +
            "       operador.unidade.id = :unidadeId " +
            "   )"
    )
    List<String> getHashsByUnidadeId(@Param("unidadeId") final long unidadeId);

    /**
     * @param nome String
     * @return List<Unidade>
     */
    List<Unidade> findByNome(final String nome);
}
