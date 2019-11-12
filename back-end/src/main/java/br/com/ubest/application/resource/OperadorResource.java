package br.com.ubest.application.resource;

import br.com.ubest.domain.entity.usuario.Perfil;
import br.com.ubest.domain.entity.usuario.vinculo.Operador;
import br.com.ubest.domain.service.OperadorService;
import br.com.ubest.infrastructure.resource.AbstractResource;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping({"**operadores", "**public/operadores", "**sistema/operadores", "**sistema/mobile/operadores"})
public class OperadorResource extends AbstractResource<Operador> {

    private final OperadorService operadorService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Operador> save(@RequestBody final Operador operador) {
        return Mono.just(this.operadorService.save(operador));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Operador> update(@PathVariable final long id, @RequestBody final Operador operador) {
        return Mono.just(this.operadorService.save(id, operador));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Boolean> delete(@PathVariable final long id) {
        this.operadorService.delete(id);
        return Mono.just(true);
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    public Mono<Optional<Operador>> findOperadorById(@PathVariable final long id) {
        return Mono.just(this.operadorService.findById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<Page<Operador>> listByFilters(final String defaultFilter, final String enderecoFilter, final Long usuarioId, final Long unidadeId) {
        return Mono.just(this.operadorService.listByFilters(defaultFilter, enderecoFilter, usuarioId, unidadeId, getPageable()));
    }
}
