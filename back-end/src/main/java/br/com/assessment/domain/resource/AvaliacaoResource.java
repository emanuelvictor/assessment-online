package br.com.assessment.domain.resource;

import br.com.assessment.domain.entity.avaliacao.Avaliacao;
import br.com.assessment.domain.entity.avaliacao.AvaliacaoColaborador;
import br.com.assessment.domain.entity.usuario.Perfil;
import br.com.assessment.domain.service.AvaliacaoService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Optional;

import static br.com.assessment.application.context.Context.getPageable;

@RestController
@RequiredArgsConstructor
@RequestMapping({"**avaliacoes", "**sistema/avaliacoes", "**sistema/mobile/avaliacoes"})
public class AvaliacaoResource {

    private final AvaliacaoService avaliacaoService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Avaliacao> save(@RequestBody final Avaliacao avaliacao) {
        return Mono.just(this.avaliacaoService.save(avaliacao));
    }

    @PostMapping("colaboradores")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<AvaliacaoColaborador> save(@RequestBody final AvaliacaoColaborador avaliacaoColaborador) {
        return Mono.just(this.avaliacaoService.save(avaliacaoColaborador));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Avaliacao> update(@PathVariable final long id, @RequestBody final Avaliacao avaliacao) {
        return Mono.just(this.avaliacaoService.save(id, avaliacao));
    }

    @DeleteMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Boolean> delete(@RequestParam long avaliacaoId) {
        this.avaliacaoService.delete(avaliacaoId);
        return Mono.just(true);
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Optional<Avaliacao>> findById(@PathVariable final long id) {
        return Mono.just(this.avaliacaoService.findById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    Mono<Page<Avaliacao>> listByFilters(final String defaultFilter) {
        return Mono.just(this.avaliacaoService.listByFilters(defaultFilter, getPageable()));
    }
}