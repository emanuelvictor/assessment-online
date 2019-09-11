package br.com.ubest.application.resource;

import br.com.ubest.domain.entity.avaliacao.TipoAvaliacao;
import br.com.ubest.domain.entity.usuario.Perfil;
import br.com.ubest.domain.service.TipoAvaliacaoService;
import br.com.ubest.infrastructure.resource.AbstractResource;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Optional;

import static br.com.ubest.infrastructure.suport.Utils.getListFromArray;

@RestController
@RequiredArgsConstructor
@RequestMapping({"tipos-avaliacoes", "sistema/tipos-avaliacoes", "sistema/mobile/tipos-avaliacoes"})
public class TipoAvaliacaoResource extends AbstractResource<TipoAvaliacao> {

    private final TipoAvaliacaoService tipoAvaliacaoService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<TipoAvaliacao> save(@RequestBody final TipoAvaliacao tipoAvaliacao) {
        return Mono.just(this.tipoAvaliacaoService.save(tipoAvaliacao));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<TipoAvaliacao> update(@PathVariable final long id, @RequestBody final TipoAvaliacao tipoAvaliacao) {
        return Mono.just(this.tipoAvaliacaoService.save(id, tipoAvaliacao));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Boolean> delete(@PathVariable final long id) {
        this.tipoAvaliacaoService.delete(id);
        return Mono.just(true);
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    public Mono<Optional<TipoAvaliacao>> findById(@PathVariable final long id) {
        return Mono.just(this.tipoAvaliacaoService.findById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    Mono<Page<TipoAvaliacao>> listByFilters(final String defaultFilter, final Long[] unidadesFilter) {
        return Mono.just(this.tipoAvaliacaoService.listByFilters(defaultFilter, getListFromArray(unidadesFilter), getPageable()));
    }

    @GetMapping("light")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    Mono<Page<TipoAvaliacao>> listLightByFilters(final String defaultFilter, final Long[] idsFilter) {
        return Mono.just(this.tipoAvaliacaoService.listLightByFilters(defaultFilter, getListFromArray(idsFilter), getPageable()));
    }
}
