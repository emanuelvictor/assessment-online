package br.com.assessment.domain.resource;

import br.com.assessment.domain.service.UsuarioService;
import br.com.assessment.domain.entity.usuario.Usuario;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/usuarios")
public class UsuarioResource {

    private final UsuarioService usuarioService;

    //Note Spring Boot 4.3+ autowires single constructors now
    public UsuarioResource(final UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public Mono<Usuario> insertUsuario(@RequestBody Usuario usuario) {
        return this.usuarioService.insertUser(usuario);
    }

    @GetMapping
    public Flux<Usuario> findAll() {
        return this.usuarioService.findAll();
    }
}