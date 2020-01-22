package online.meavalia.application.resource;

import lombok.RequiredArgsConstructor;
import online.meavalia.domain.entity.avaliacao.TipoAvaliacao;
import online.meavalia.domain.entity.usuario.Perfil;
import online.meavalia.domain.service.TipoAvaliacaoService;
import online.meavalia.infrastructure.resource.AbstractResource;
import online.meavalia.infrastructure.suport.Utils;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping({"tipos-avaliacoes", "public/tipos-avaliacoes", "sistema/tipos-avaliacoes", "sistema/mobile/tipos-avaliacoes"})
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
        return Mono.just(this.tipoAvaliacaoService.listByFilters(defaultFilter, Utils.getListFromArray(unidadesFilter), getPageable()));
    }

    @GetMapping("light")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    Mono<Page<TipoAvaliacao>> listLightByFilters(final String defaultFilter, final Long[] idsFilter) {
        return Mono.just(this.tipoAvaliacaoService.listLightByFilters(defaultFilter, Utils.getListFromArray(idsFilter), getPageable()));
    }
}