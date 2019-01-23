package br.com.assessment.domain.resource;

import br.com.assessment.domain.entity.avaliacao.Avaliacao;
import br.com.assessment.domain.entity.avaliacao.AvaliacaoAvaliavel;
import br.com.assessment.domain.entity.usuario.Perfil;
import br.com.assessment.domain.service.AvaliacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Optional;

import static br.com.assessment.application.context.LocalContext.getPageable;
import static br.com.assessment.infrastructure.util.ArrayUtil.getListFromArray;

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

    @PostMapping("/avaliacoes-avaliaveis") // TODO??? não vai mais existir
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<AvaliacaoAvaliavel> save(@RequestBody final AvaliacaoAvaliavel avaliacaoAvaliavel) {
        return Mono.just(this.avaliacaoService.save(avaliacaoAvaliavel));
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