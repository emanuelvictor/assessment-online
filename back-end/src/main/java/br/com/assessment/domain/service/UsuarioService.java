package br.com.assessment.domain.service;

import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.repository.UsuarioRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

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
    public Mono<UserDetails> findByUsername(final String email) {
        if (email.equals(Usuario.MASTER_USER_EMAIL)) {
            return Mono.just(Usuario.getMasterUser());
        }
        return Mono.just(usuarioRepository.findByEmail(email));
    }

    /**
     *
     */
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Mono<Usuario> save(final Mono<Usuario> usuario) {

        return Mono.create(monoSink ->
                usuario.subscribe(usuarioToSave -> {
                            usuarioToSave.setPassword(this.passwordEncoder.encode(usuarioToSave.getPassword()));
                            monoSink.success(this.usuarioRepository.save(usuarioToSave));
                        }
                )
        );

    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public void delete(final long usuarioId) {
        this.usuarioRepository.deleteById(usuarioId);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Flux<Usuario> findAll() {

        final List<Usuario> list = this.usuarioRepository.findAll();

        return Flux.just(list.toArray(new Usuario[list.size()]));
    }

}