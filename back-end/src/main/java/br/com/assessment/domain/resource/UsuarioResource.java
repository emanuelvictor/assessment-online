package br.com.assessment.domain.resource;

import br.com.assessment.domain.service.UsuarioService;
import br.com.assessment.domain.entity.usuario.Usuario;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/users")
public class UsuarioResource {

    private final UsuarioService usuarioService;

    //Note Spring Boot 4.3+ autowires single constructors now
    public UsuarioResource(final UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    /**
     * TODO parâmetro deve ser um Mono
     * @param usuarioMono
     * @return
     */
    @PostMapping
    public Mono<Usuario> insertUsuario(@RequestBody Mono<Usuario> usuarioMono) {
        return this.usuarioService.insertUser(usuarioMono);
    }

    @GetMapping
    public Flux<Usuario> findAll() {
        return this.usuarioService.findAll();
    }
}