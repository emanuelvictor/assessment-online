package online.meavalia.application.resource;

import lombok.RequiredArgsConstructor;
import online.meavalia.domain.entity.usuario.Perfil;
import online.meavalia.domain.entity.usuario.vinculo.Avaliavel;
import online.meavalia.domain.AvaliavelService;
import online.meavalia.infrastructure.resource.AbstractResource;
import online.meavalia.infrastructure.suport.Utils;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping({"**avaliaveis", "**public/avaliaveis", "**sistema/avaliaveis", "**sistema/mobile/avaliaveis"})
public class AvaliavelResource extends AbstractResource<Avaliavel> {

    /**
     *
     */
    private final AvaliavelService avaliavelService;

    /**
     * @param avaliaveis
     * @return
     */
    @PostMapping("all")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<List<Avaliavel>> save(@RequestBody final Avaliavel[] avaliaveis) {
        return Mono.just(this.avaliavelService.save(Utils.getListFromArray(avaliaveis)));
    }

    /**
     * @param avaliavel
     * @return
     */
    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Avaliavel> save(@RequestBody final Avaliavel avaliavel) {
        return Mono.just(this.avaliavelService.save(avaliavel));
    }

    /**
     * @param id
     * @param avaliavel
     * @return
     */
    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Avaliavel> update(@PathVariable final long id, @RequestBody final Avaliavel avaliavel) {
        return Mono.just(this.avaliavelService.save(id, avaliavel));
    }

    /**
     * @param id
     * @return
     */
    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Boolean> delete(@PathVariable final long id) {
        this.avaliavelService.delete(id);
        return Mono.just(true);
    }

    /**
     * @param id
     * @return
     */
    @GetMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    public Mono<Optional<Avaliavel>> findAvaliavelById(@PathVariable final long id) {
        return Mono.just(this.avaliavelService.findById(id));
    }

    /**
     * @param defaultFilter
     * @param usuarioId
     * @param unidadeId
     * @param ativo
     * @param unidadeTipoAvaliacaoDispositivoId
     * @return
     */
    @GetMapping
    Mono<Page<Avaliavel>> listByFilters(final String defaultFilter, final Long usuarioId, final Long unidadeId, final Boolean ativo, final Long unidadeTipoAvaliacaoDispositivoId) {
        return Mono.just(this.avaliavelService.listByFilters(defaultFilter, usuarioId, unidadeId, ativo, unidadeTipoAvaliacaoDispositivoId, getPageable()));
    }
}
