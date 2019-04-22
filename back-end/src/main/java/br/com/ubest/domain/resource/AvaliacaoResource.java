package br.com.ubest.domain.resource;

import br.com.ubest.domain.entity.avaliacao.Avaliacao;
import br.com.ubest.domain.entity.avaliacao.AvaliacaoAvaliavel;
import br.com.ubest.domain.entity.usuario.Perfil;
import br.com.ubest.domain.service.AvaliacaoService;
import br.com.ubest.infrastructure.resource.AbstractResource;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Optional;

import static br.com.ubest.infrastructure.util.Utils.getListFromArray;

@RestController
@RequiredArgsConstructor
@RequestMapping({"**avaliacoes", "**sistema/avaliacoes", "**sistema/mobile/avaliacoes"})
public class AvaliacaoResource extends AbstractResource<Avaliacao> {

    private final AvaliacaoService avaliacaoService;

    @PostMapping("/avaliacoes-avaliaveis") // TODO??? não vai mais existir
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<AvaliacaoAvaliavel> save(@RequestBody final AvaliacaoAvaliavel avaliacaoAvaliavel) {
        return Mono.just(this.avaliacaoService.save(avaliacaoAvaliavel));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Avaliacao> save(@RequestBody final Avaliacao avaliacao) {
        return Mono.just(this.avaliacaoService.save(avaliacao));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Avaliacao> update(@PathVariable final long id, @RequestBody final Avaliacao avaliacao) {
        return Mono.just(this.avaliacaoService.save(id, avaliacao));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ROOT_VALUE + "')")
    public Mono<Boolean> delete(@PathVariable long id) {
        this.avaliacaoService.delete(id);
        return Mono.just(true);
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Optional<Avaliacao>> findById(@PathVariable final long id) {
        return Mono.just(this.avaliacaoService.findById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    Mono<Page<Avaliacao>> listByFilters(final Long[] unidadesFilter,
                                        final Long[] usuariosFilter,
                                        @RequestParam(required = false) final LocalDateTime dataInicioFilter,
                                        @RequestParam(required = false) final LocalDateTime dataTerminoFilter) {
        return Mono.just(this.avaliacaoService.listByFilters(getListFromArray(unidadesFilter), getListFromArray(usuariosFilter), dataInicioFilter, dataTerminoFilter, getPageable()));
    }
}
