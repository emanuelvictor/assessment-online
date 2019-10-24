package br.com.ubest.application.resource;

import br.com.ubest.domain.entity.avaliacao.Agrupador;
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

import static br.com.ubest.infrastructure.suport.Utils.getListFromArray;

@RestController
@RequiredArgsConstructor
@RequestMapping({"**avaliacoes", "**sistema/avaliacoes", "**sistema/mobile/avaliacoes"})
public class AvaliacaoResource extends AbstractResource<Avaliacao> {

    /**
     *
     */
    private final AvaliacaoService avaliacaoService;

    /**
     *
     * @param agrupador
     * @return
     */
    @PostMapping("/agrupador")
    public Mono<Agrupador> save(@RequestBody final Agrupador agrupador) {
        return this.avaliacaoService.save(agrupador);
    }

    /**
     *
     * @param id
     * @param agrupador
     * @return
     */
    @PutMapping("/agrupador/{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Agrupador> save(@PathVariable final long id, @RequestBody final Agrupador agrupador) {
        return Mono.just(this.avaliacaoService.save(id, agrupador));
    }

//    @PostMapping todo remover
//    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
//    public Mono<Avaliacao> save(@RequestBody final Avaliacao avaliacao) {
//        return Mono.just(this.avaliacaoService.save(avaliacao));
//    }

    /**
     *
     * @param id
     * @param avaliacao
     * @return
     */
    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Avaliacao> update(@PathVariable final long id, @RequestBody final Avaliacao avaliacao) {
        return Mono.just(this.avaliacaoService.save(id, avaliacao));
    }

    /**
     *
     * @param id
     * @return
     */
    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Boolean> delete(@PathVariable long id) {
        this.avaliacaoService.delete(id);
        return Mono.just(true);
    }

    /**
     *
     * @param id
     * @return
     */
    @GetMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Optional<Avaliacao>> findById(@PathVariable final long id) {
        return Mono.just(this.avaliacaoService.findById(id));
    }

    /**
     *
     * @param defaultFilter
     * @param unidadesFilter
     * @param dispositivosFilter
     * @param usuariosFilter
     * @param tiposAvaliacoesFilter
     * @param hasFeedback
     * @param dataInicioFilter
     * @param dataTerminoFilter
     * @return
     */
    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    Mono<Page<Avaliacao>> listByFilters(final String defaultFilter,
                                        final Long[] unidadesFilter,
                                        final Long[] dispositivosFilter,
                                        final Long[] usuariosFilter,
                                        final Long[] tiposAvaliacoesFilter,
                                        final Boolean hasFeedback,
                                        @RequestParam(required = false) final LocalDateTime dataInicioFilter,
                                        @RequestParam(required = false) final LocalDateTime dataTerminoFilter) {
        return Mono.just(this.avaliacaoService.listByFilters(defaultFilter, getListFromArray(unidadesFilter), getListFromArray(dispositivosFilter), getListFromArray(usuariosFilter), getListFromArray(tiposAvaliacoesFilter), hasFeedback, dataInicioFilter, dataTerminoFilter, getPageable()));
    }
}
