package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.usuario.Conta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContaRepository extends JpaRepository<Conta, Long> {

    /**
     * @param email String
     * @return Conta
     */
    Conta findByEmailIgnoreCase(final String email);

}
