package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.usuario.Conta;
import br.com.assessment.domain.entity.usuario.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContaRepository extends JpaRepository<Conta, Long> {

    /**
     * @param email String
     * @return Conta
     */
    Conta findByEmailIgnoreCase(final String email);

}
