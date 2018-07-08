package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.usuario.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     *
     * @param email
     * @return
     */
    Usuario findByEmail(final String email);

}
