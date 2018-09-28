package br.com.assessment.domain.resource;

import br.com.assessment.domain.entity.unidade.Unidade;
import br.com.assessment.domain.entity.usuario.Perfil;
import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.service.UnidadeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Optional;

import static br.com.assessment.application.context.Context.getPageable;
import static br.com.assessment.infrastructure.util.ArrayUtil.getListFromArray;

@RestController
@RequiredArgsConstructor
@RequestMapping("/unidades")
public class UnidadeResource {

    private final UnidadeService unidadeService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Unidade> save(@RequestBody final Unidade unidade) {
        return Mono.just(this.unidadeService.save(unidade));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Unidade> save(@PathVariable final long id, @RequestBody final Unidade unidade) {
        return Mono.just(this.unidadeService.save(id, unidade));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Boolean> delete(@PathVariable final long id) {
        this.unidadeService.delete(id);
        return Mono.just(true);
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Optional<Unidade>> findById(@PathVariable final long id) {
        return Mono.just(this.unidadeService.findById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<Page<Unidade>> listByFilters(final String defaultFilter, final String enderecoFilter,
                                      @RequestParam(required = false) final LocalDateTime dataInicioFilter,
                                      @RequestParam(required = false) final LocalDateTime dataTerminoFilter) {
        return Mono.just(this.unidadeService.listByFilters(defaultFilter, enderecoFilter, dataInicioFilter, dataTerminoFilter, getPageable()));
    }
}