package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.usuario.vinculo.Operador;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OperadorRepository extends JpaRepository<Operador, Long> {

    @Query(" SELECT operador FROM Operador operador " +
            "       LEFT OUTER JOIN Endereco endereco ON operador.dispositivo.endereco.id = endereco.id " +
            "       LEFT OUTER JOIN Cidade cidade ON cidade.id = endereco.cidade.id " +
            "       LEFT OUTER JOIN Estado estado ON estado.id = cidade.estado.id " +
            "       LEFT OUTER JOIN Pais pais ON pais.id = estado.pais.id " +
            "   WHERE " +
            "   (" +
            "       (" +
            "           (:dispositivoId IS NULL AND (:usuarioId IS NOT NULL AND operador.usuario.id = :usuarioId)) " +
            "           OR " +
            "           (:usuarioId IS NULL AND (:dispositivoId IS NOT NULL AND operador.dispositivo.id = :dispositivoId))" +
            "           OR :usuarioId IS NULL AND :dispositivoId IS NULL " +
            "       )" +
            "       AND FILTER(:defaultFilter, operador.dispositivo.nome) = TRUE" +
            "       AND " +
            "       (" +
            "           FILTER(:enderecoFilter, endereco.logradouro, endereco.complemento, endereco.bairro, endereco.cep, endereco.numero, cidade.nome, estado.uf, estado.nome, pais.nome) = TRUE" +
            "       )" +
            "   )"
    )
    Page<Operador> listByFilters(@Param("defaultFilter") final String defaultFilter,
                                 @Param("enderecoFilter") final String enderecoFilter,
                                 @Param("usuarioId") final Long usuarioId,
                                 @Param("dispositivoId") final Long dispositivoId,
                                 final Pageable pageable);

    List<Operador> findAllByDispositivoId(final long dispositivoId);

    List<Operador> findAllByUsuarioId(final long usuarioId);

}
