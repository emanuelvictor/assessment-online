package br.com.assessment.domain.resource;

import br.com.assessment.domain.entity.colaborador.Colaborador;
import br.com.assessment.domain.entity.unidade.Unidade;
import br.com.assessment.domain.service.ColaboradorService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Optional;

import static br.com.assessment.application.context.Context.getPageable;
import static br.com.assessment.application.context.Context.getPageable;
@RestController
@AllArgsConstructor
@RequestMapping("/colaboradores")
public class ColaboradorResource {

    private final ColaboradorService colaboradorService;

    @PostMapping
    @PreAuthorize("hasRole('OPERADOR')")
    public Mono<Colaborador> save(@RequestBody final Colaborador colaborador) {
        return this.colaboradorService.save(colaborador);
    }

    @PutMapping("{id}")
    @PreAuthorize("hasRole('OPERADOR')")
    public Mono<Colaborador> update(@PathVariable final long id, @RequestBody final Colaborador colaborador) {
        return this.colaboradorService.save(id, colaborador);
    }

    @DeleteMapping
    @PreAuthorize("hasRole('OPERADOR')")
    public void delete(@RequestParam long colaboradorId) {
        this.colaboradorService.delete(colaboradorId);
    }

    @GetMapping("{id}")
    public Mono<Optional<Colaborador>> findColaboradorById(@PathVariable final long id) {
        return this.colaboradorService.findById(id);
    }

    @GetMapping
    @PreAuthorize("hasRole('ATENDENTE')")
    Mono<Page<Colaborador>> listByFilters(final String defaultFilter, final String enderecoFilter, final Long usuarioId) {
        return Mono.just(this.colaboradorService.listByFilters(defaultFilter, enderecoFilter, usuarioId, getPageable()));
    }
}