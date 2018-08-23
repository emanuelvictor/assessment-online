package br.com.assessment.domain.resource;

import br.com.assessment.domain.entity.unidade.Unidade;
import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.service.UnidadeService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Optional;

import static br.com.assessment.application.context.Context.getPageable;

@RestController
@RequiredArgsConstructor
@RequestMapping("/unidades")
public class UnidadeResource {

    private final UnidadeService unidadeService;

    @PostMapping
    public Mono<Unidade> save(@RequestBody final Unidade unidade) {
        return this.unidadeService.save(unidade);
    }

    @PutMapping("{id}")
    public Mono<Unidade> save(@PathVariable final long id, @RequestBody final Unidade unidade) {
        return this.unidadeService.save(id, unidade);
    }

    @DeleteMapping("{id}")
    public Mono<Boolean> delete(@PathVariable final long id) {
        return this.unidadeService.delete(id);
    }

    @GetMapping("{id}")
    public Mono<Optional<Unidade>> findById(@PathVariable final long id) {
        return this.unidadeService.findById(id);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    Mono<Page<Unidade>> listByFilters(final String defaultFilter, final String enderecoFilter) {
        return Mono.just(this.unidadeService.listByFilters(defaultFilter, enderecoFilter, getPageable()));
    }
}