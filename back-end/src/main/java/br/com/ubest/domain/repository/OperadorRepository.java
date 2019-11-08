package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.usuario.vinculo.Operador;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OperadorRepository extends JpaRepository<Operador, Long> {

    /**
     * @param defaultFilter
     * @param enderecoFilter
     * @param usuarioId
     * @param unidadeId
     * @param pageable
     * @return
     */
    @Query(" SELECT operador FROM Operador operador " +
            "       LEFT OUTER JOIN Endereco endereco ON operador.unidade.endereco.id = endereco.id " +
            "       LEFT OUTER JOIN Cidade cidade ON cidade.id = endereco.cidade.id " +
            "       LEFT OUTER JOIN Estado estado ON estado.id = cidade.estado.id " +
            "       LEFT OUTER JOIN Pais pais ON pais.id = estado.pais.id " +
            "   WHERE " +
            "   (" +
            "       (" +
            "           (:unidadeId IS NULL AND (:usuarioId IS NOT NULL AND operador.usuario.id = :usuarioId)) " +
            "           OR " +
            "           (:usuarioId IS NULL AND (:unidadeId IS NOT NULL AND operador.unidade.id = :unidadeId))" +
            "           OR :usuarioId IS NULL AND :unidadeId IS NULL " +
            "       )" +
            "       AND FILTER(:defaultFilter, operador.unidade.nome) = TRUE" +
            "       AND " +
            "       (" +
            "           FILTER(:enderecoFilter, endereco.logradouro, endereco.complemento, endereco.bairro, endereco.cep, endereco.numero, cidade.nome, estado.uf, estado.nome, pais.nome) = TRUE" +
            "       )" +
            "   )"
    )
    Page<Operador> listByFilters(@Param("defaultFilter") final String defaultFilter,
                                 @Param("enderecoFilter") final String enderecoFilter,
                                 @Param("usuarioId") final Long usuarioId,
                                 @Param("unidadeId") final Long unidadeId,
                                 final Pageable pageable);

    /**
     * @param unidadeId
     * @return
     */
    List<Operador> findAllByUnidadeId(final long unidadeId);

    /**
     * @param usuarioId
     * @return
     */
    List<Operador> findAllByUsuarioId(final long usuarioId);

}
