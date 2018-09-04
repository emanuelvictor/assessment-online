package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.colaborador.Colaborador;
import br.com.assessment.domain.entity.unidade.Unidade;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ColaboradorRepository extends JpaRepository<Colaborador, Long> {

    @Query
            (
                    " SELECT colaborador FROM Colaborador colaborador WHERE " +
                            "(" +
                            "   (" +
                            "       (:unidadeId IS NULL AND (:usuarioId IS NOT NULL AND colaborador.usuario.id = :usuarioId)) " +
                            "       OR " +
                            "       (:usuarioId IS NULL AND (:unidadeId IS NOT NULL AND colaborador.unidade.id = :unidadeId))" +
                            "       OR :usuarioId IS NULL AND :unidadeId IS NULL " +
                            "   )" +
                            "   AND " +
                            "   FILTER(colaborador.unidade.nome, :defaultFilter) = TRUE" +
                            "   AND " +
                            "   (" +
                            "       FILTER(colaborador.unidade.endereco.logradouro, :enderecoFilter) = TRUE" +
                            "       OR FILTER(colaborador.unidade.endereco.complemento, :enderecoFilter) = TRUE" +
                            "       OR FILTER(colaborador.unidade.endereco.bairro, :enderecoFilter) = TRUE" +
                            "       OR FILTER(colaborador.unidade.endereco.cep, :enderecoFilter) = TRUE" +
                            "       OR FILTER(colaborador.unidade.endereco.numero, :enderecoFilter) = TRUE" +
                            "       OR FILTER(colaborador.unidade.endereco.cidade.nome, :enderecoFilter) = TRUE" +
                            "       OR FILTER(colaborador.unidade.endereco.cidade.estado.nome, :enderecoFilter) = TRUE" +
                            "       OR FILTER(colaborador.unidade.endereco.cidade.estado.uf, :enderecoFilter) = TRUE" +
                            "       OR FILTER(colaborador.unidade.endereco.cidade.estado.pais.nome, :enderecoFilter) = TRUE" +
                            "   )" +
                            ")"
            )
    Page<Colaborador> listByFilters(@Param("defaultFilter") final String defaultFilter,
                                    @Param("enderecoFilter") final String enderecoFilter,
                                    @Param("usuarioId") final Long usuarioId,
                                    @Param("unidadeId") final Long unidadeId,
                                    final Pageable pageable);

}
