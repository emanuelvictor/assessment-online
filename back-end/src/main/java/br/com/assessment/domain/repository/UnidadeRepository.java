package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.unidade.Unidade;
import br.com.assessment.domain.entity.usuario.Perfil;
import br.com.assessment.domain.entity.usuario.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface UnidadeRepository extends JpaRepository<Unidade, Long> {


    @Query("SELECT new Unidade( " +
            "   unidade.id, " +
            "   unidade.nome, " +
            "   unidade.documento, " +
            "   unidade.endereco," +
            "   AVG(CASE WHEN avaliacao.nota IS NULL THEN 0 ELSE avaliacao.nota END) AS media," +
            "   COUNT(avaliacao) AS quantidadeAvaliacoes," +
            "   COUNT(av1) AS avaliacoes1," +
            "   COUNT(av2) AS avaliacoes2," +
            "   COUNT(av3) AS avaliacoes3," +
            "   COUNT(av4) AS avaliacoes4," +
            "   COUNT(av5) AS avaliacoes5" +
            ") FROM Unidade unidade " +
            "       LEFT OUTER JOIN Colaborador colaborador ON colaborador.unidade.id = unidade.id " +
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
            "               FILTER(:defaultFilter, unidade.nome, unidade.endereco.logradouro,unidade.endereco.complemento,unidade.endereco.bairro, unidade.endereco.cep,unidade.endereco.numero,unidade.endereco.cidade.nome,unidade.endereco.cidade.estado.nome,unidade.endereco.cidade.estado.uf,unidade.endereco.cidade.estado.pais.nome) = TRUE" +
            "       )" +
            "       AND " +
            "       (" +
            "               FILTER(:enderecoFilter, unidade.endereco.logradouro,unidade.endereco.complemento,unidade.endereco.bairro, unidade.endereco.cep,unidade.endereco.numero,unidade.endereco.cidade.nome,unidade.endereco.cidade.estado.nome,unidade.endereco.cidade.estado.uf,unidade.endereco.cidade.estado.pais.nome) = TRUE" +
            "       )" +
            "       AND" +
            "       (:perfil != '" + Perfil.ADMINISTRADOR_VALUE + "' AND unidade.id IN " +
            "       (" +
            "           SELECT colaborador.unidade.id FROM Colaborador colaborador WHERE " +
            "           (" +
            "               colaborador.usuario.id = :usuarioId" +
            "               AND " +
            "               (" +
            "                   (" +
            "                       :perfil = '" + Perfil.ATENDENTE_VALUE + "' AND (colaborador.vinculo = 0) " +
            "                   )" +
            "                   OR " +
            "                   (" +
            "                       :perfil = '" + Perfil.OPERADOR_VALUE + "' AND (colaborador.vinculo = 1 OR colaborador.vinculo = 2)" +
            "                   )" +
            "               )" +
            "           )" +
            "       ) OR :perfil = '" + Perfil.ADMINISTRADOR_VALUE + "')" +
            "   )" +
            "GROUP BY unidade.id, unidade.nome, unidade.documento"
    )
    Page<Unidade> listByFilters(
            @Param("usuarioId") final Long usuarioId,
            @Param("perfil") final String perfil,
            @Param("defaultFilter") final String defaultFilter,
            @Param("enderecoFilter") final String enderecoFilter,
            @Param("dataInicioFilter") final LocalDateTime dataInicioFilter,
            @Param("dataTerminoFilter") final LocalDateTime dataTerminoFilter,
            final Pageable pageable);

    List<Unidade> findByNome(final String nome);

}
