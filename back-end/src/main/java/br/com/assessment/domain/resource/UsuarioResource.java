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
    public Mono<Usuario> save(@RequestBody Mono<Usuario> usuario) {
        return this.usuarioService.save(usuario);
    }

    @DeleteMapping
    public void delete(@RequestParam long usuarioId) {
        this.usuarioService.delete(usuarioId);
    }

    @GetMapping
    public Flux<Usuario> findAll() {
        return this.usuarioService.findAll();
    }
}