package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.usuario.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

public interface UsuarioRepository
        extends JpaRepository<Usuario, Long>
{

//    /**
//     * @return
//     */
//    Flux<Usuario> findByName(Mono<String> nome);
//
//
    /**
     * @return
     */
    UserDetails findByUsername(String username);

}
