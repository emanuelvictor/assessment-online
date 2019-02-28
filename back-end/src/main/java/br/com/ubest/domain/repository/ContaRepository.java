package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.usuario.Conta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ContaRepository extends JpaRepository<Conta, Long> {

    /**
     * @param email String
     * @return Conta
     */
    Conta findByEmailIgnoreCase(final String email);

    /**
     *
     */
    @Query("SELECT new Conta( " +
            "   conta.id, " +
            "   conta.administrador, " +
            "   conta.root,  " +
            "   conta.esquema, " +
            "   conta.email, " +
            "   conta.password, " +
            "   conta.lastLogin, " +
            "   usuario" +
            ") FROM Conta conta " +
            "       LEFT OUTER JOIN Usuario usuario ON usuario.conta.id = conta.id " +
            "   WHERE" +
            "   (   " +
            "       (" +
            "           FILTER(:defaultFilter, usuario.nome, conta.email) = TRUE" +
            "       )" +
            "       AND conta.administrador = TRUE" +
            "   )" +
            "GROUP BY conta.id, usuario.id, usuario.created, usuario.updated, usuario.documento, usuario.nome"
    )
    Page<Conta> listByFilters(@Param("defaultFilter") final String defaultFilter, final Pageable pageable);

}
