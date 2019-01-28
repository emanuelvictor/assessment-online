package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.usuario.vinculo.Operador;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OperadorRepository extends JpaRepository<Operador, Long> {

    @Query
            (
                    " SELECT operador FROM Operador operador WHERE" +
                            "(" +
                            "   (" +
                            "       (:unidadeId IS NULL AND (:usuarioId IS NOT NULL AND operador.usuario.id = :usuarioId)) " +
                            "       OR " +
                            "       (:usuarioId IS NULL AND (:unidadeId IS NOT NULL AND operador.unidade.id = :unidadeId))" +
                            "       OR :usuarioId IS NULL AND :unidadeId IS NULL " +
                            "   )" +
                            "   AND FILTER(:defaultFilter, operador.unidade.nome) = TRUE" +
                            "   AND " +
                            "   (" +
                            "       FILTER(:enderecoFilter, operador.unidade.endereco.logradouro, operador.unidade.endereco.complemento, operador.unidade.endereco.bairro, operador.unidade.endereco.cep, operador.unidade.endereco.numero, operador.unidade.endereco.cidade.nome, operador.unidade.endereco.cidade.estado.uf, operador.unidade.endereco.cidade.estado.pais.nome) = TRUE" +
                            "   )" +
                            ")"
            )
    Page<Operador> listByFilters(@Param("defaultFilter") final String defaultFilter,
                                 @Param("enderecoFilter") final String enderecoFilter,
                                 @Param("usuarioId") final Long usuarioId,
                                 @Param("unidadeId") final Long unidadeId,
                                 final Pageable pageable);

    List<Operador> findAllByUnidadeId(final long unidadeId);
}
