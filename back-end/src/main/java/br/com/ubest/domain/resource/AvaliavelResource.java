package br.com.ubest.domain.resource;

import br.com.ubest.domain.entity.usuario.Perfil;
import br.com.ubest.domain.entity.usuario.vinculo.Avaliavel;
import br.com.ubest.domain.service.AvaliavelService;
import br.com.ubest.infrastructure.resource.AbstractResource;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping({"**avaliaveis", "**sistema/avaliaveis", "**sistema/mobile/avaliaveis"})
public class AvaliavelResource extends AbstractResource<Avaliavel> {

    private final AvaliavelService avaliavelService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Avaliavel> save(@RequestBody final Avaliavel avaliavel) {
        return Mono.just(this.avaliavelService.save(avaliavel));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Avaliavel> update(@PathVariable final long id, @RequestBody final Avaliavel avaliavel) {
        return Mono.just(this.avaliavelService.save(id, avaliavel));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Boolean> delete(@PathVariable final long id) {
        this.avaliavelService.delete(id);
        return Mono.just(true);
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    public Mono<Optional<Avaliavel>> findAvaliavelById(@PathVariable final long id) {
        return Mono.just(this.avaliavelService.findById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<Page<Avaliavel>> listByFilters(final String defaultFilter, final Long usuarioId, final Long unidadeId, final Boolean ativo, final Long unidadeTipoAvaliacaoId) {
        return Mono.just(this.avaliavelService.listByFilters(defaultFilter, usuarioId, unidadeId, ativo, unidadeTipoAvaliacaoId, getPageable()));
    }
}
