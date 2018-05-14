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
     * O parâmero pode ser um mono? TODO
     */
    public Mono<UserDetails> findByUsername(String username) {
        if (username.equals(Usuario.MASTER_USERNAME)) {
            UserDetails userDetails = Usuario.getMasterUser();
            return Mono.just(userDetails);
        }
        return Mono.just(usuarioRepository.findByUsername(username));
    }

    /**
     *
     * O parâmero pode ser um mono? TODO
     */
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public Mono<Usuario> insertUser(final Mono<Usuario> usuario) {
        final Usuario usuarioToSave = usuario.block();
        usuarioToSave.setPassword(this.passwordEncoder.encode(usuarioToSave.getPassword()));
        return Mono.just(this.usuarioRepository.save(usuarioToSave));
    }

//    @PreAuthorize("hasRole('ADMINISTRATOR')")
//    public void removeUser(long usuarioId) {
//        this.usuarioRepository.deleteById(usuarioId);
//    }

    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public Flux<Usuario> findAll() {

        final List<Usuario> list = this.usuarioRepository.findAll();

        final Usuario[] usuarios = this.usuarioRepository.findAll().toArray(new Usuario[list.size()]);

        return Flux.just(usuarios);
    }

}