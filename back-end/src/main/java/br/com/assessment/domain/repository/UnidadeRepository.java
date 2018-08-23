package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.unidade.Unidade;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UnidadeRepository extends JpaRepository<Unidade, Long> {

    @Query
            (
                    " SELECT unidade FROM Unidade unidade WHERE " +
                            "(" +
                            "    FILTER(unidade.nome, :defaultFilter) = TRUE" +
                            "    AND " +
                            "   (" +
                            "       FILTER(unidade.endereco.logradouro, :enderecoFilter) = TRUE" +
                            "       OR FILTER(unidade.endereco.complemento, :enderecoFilter) = TRUE" +
                            "       OR FILTER(unidade.endereco.bairro, :enderecoFilter) = TRUE" +
                            "       OR FILTER(unidade.endereco.cep, :enderecoFilter) = TRUE" +
                            "       OR FILTER(unidade.endereco.numero, :enderecoFilter) = TRUE" +
                            "       OR FILTER(unidade.endereco.cidade.nome, :enderecoFilter) = TRUE" +
                            "       OR FILTER(unidade.endereco.cidade.estado.nome, :enderecoFilter) = TRUE" +
                            "       OR FILTER(unidade.endereco.cidade.estado.uf, :enderecoFilter) = TRUE" +
                            "       OR FILTER(unidade.endereco.cidade.estado.pais.nome, :enderecoFilter) = TRUE" +
                            "   )" +
                            ")"
            )
    Page<Unidade> listByFilters(@Param("defaultFilter") final String defaultFilter,
                                @Param("enderecoFilter") final String enderecoFilter,
                                final Pageable pageable);

}
