package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.usuario.Conta;
import br.com.assessment.domain.entity.usuario.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContaRepository extends JpaRepository<Conta, Long> {

    /**
     *
     * @param email String
     * @return Conta
     */
    Conta findByEmail(final String email);

}
