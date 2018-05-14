package br.com.assessment.domain.service;

import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.repository.UsuarioRepository;
import org.reactivestreams.Subscriber;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;

@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    private final PasswordEncoder passwordEncoder;

    public UsuarioService(final UsuarioRepository usuarioRepository, final PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     *
     */
    public Mono<UserDetails> findByUsername(final String username) {
        if (username.equals(Usuario.MASTER_USERNAME)) {
            return Mono.just(Usuario.getMasterUser());
        }
        return Mono.just(usuarioRepository.findByUsername(username));
    }

    /**
     *
     */
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public Mono<Usuario> insertUser(final Usuario usuario) {
        return Mono.just(this.usuarioRepository.save(usuario));
    }

    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public void removeUser(long usuarioId) {
        this.usuarioRepository.deleteById(usuarioId);
    }

    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public Flux<Usuario> findAll() {

        final List<Usuario> list = this.usuarioRepository.findAll();

        return Flux.just(list.toArray(new Usuario[list.size()]));
    }

}