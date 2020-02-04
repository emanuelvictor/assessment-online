package online.meavalia.application.resource;

import lombok.AllArgsConstructor;
import online.meavalia.domain.entity.assinatura.Cupom;
import online.meavalia.domain.entity.usuario.Perfil;
import online.meavalia.domain.CupomService;
import online.meavalia.infrastructure.resource.AbstractResource;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping({"**cupons",  "**public/cupons", "**sistema/cupons", "**sistema/mobile/cupons"})
public class CupomResource extends AbstractResource<Cupom> {

    /**
     *
     */
    private final CupomService cupomService;

    /**
     * @param cupom Cupom
     * @return Mono<Cupom>
     */
    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Cupom> save(@RequestBody final Cupom cupom) {
        return Mono.just(this.cupomService.save(cupom));
    }

    /**
     * @param id    long
     * @param cupom Cupom
     * @return Mono<Cupom>
     */
    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Cupom> save(@PathVariable final long id, @RequestBody final Cupom cupom) {
        cupom.setId(id);
        return Mono.just(this.cupomService.save(cupom));
    }

    /**
     * @param id long
     * @return Mono<Boolean>
     */
    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Boolean> delete(@PathVariable final long id) {
        this.cupomService.delete(id);
        return Mono.just(true);
    }

    /**
     * @param defaultFilter String
     * @return Mono<Page < Cupom>>
     */
    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<Page<Cupom>> listByFilters(final String defaultFilter) {
        return Mono.just(cupomService.listByFilters(defaultFilter, getPageable()));
    }

    /**
     * @param id Long
     * @return Mono<Optional < Cupom>>
     */
    @GetMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<Optional<Cupom>> findById(@PathVariable final long id) {
        return Mono.just(cupomService.findById(id));
    }
}
