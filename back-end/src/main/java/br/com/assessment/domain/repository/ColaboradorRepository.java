package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.colaborador.Colaborador;
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
                            "   FILTER(:defaultFilter, colaborador.unidade.nome) = TRUE" +
                            "   AND " +
                            "   (" +
                            "       FILTER(:enderecoFilter, colaborador.unidade.endereco.logradouro, colaborador.unidade.endereco.complemento, colaborador.unidade.endereco.bairro, colaborador.unidade.endereco.cep, colaborador.unidade.endereco.numero, colaborador.unidade.endereco.cidade.nome, colaborador.unidade.endereco.cidade.estado.uf, colaborador.unidade.endereco.cidade.estado.pais.nome) = TRUE" +
                            "   )" +
                            ")"
            )
    Page<Colaborador> listByFilters(@Param("defaultFilter") final String defaultFilter,
                                    @Param("enderecoFilter") final String enderecoFilter,
                                    @Param("usuarioId") final Long usuarioId,
                                    @Param("unidadeId") final Long unidadeId,
                                    final Pageable pageable);

}
