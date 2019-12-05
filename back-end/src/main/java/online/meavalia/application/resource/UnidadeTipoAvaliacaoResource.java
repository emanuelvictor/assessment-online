package online.meavalia.application.resource;

import online.meavalia.domain.entity.avaliacao.UnidadeTipoAvaliacao;
import online.meavalia.domain.entity.usuario.Perfil;
import online.meavalia.domain.repository.UnidadeTipoAvaliacaoRepository;
import online.meavalia.domain.service.UnidadeTipoAvaliacaoService;
import online.meavalia.infrastructure.resource.AbstractResource;
import online.meavalia.infrastructure.suport.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping({"**unidade-tipos-avaliacoes", "**public/unidade-tipos-avaliacoes", "**sistema/unidade-tipos-avaliacoes", "**sistema/mobile/unidade-tipos-avaliacoes"})
public class UnidadeTipoAvaliacaoResource extends AbstractResource<UnidadeTipoAvaliacao> {

    private final UnidadeTipoAvaliacaoService unidadeTipoAvaliacaoService;

    private final UnidadeTipoAvaliacaoRepository unidadeTipoAvaliacaoRepository;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<UnidadeTipoAvaliacao> save(@RequestBody final UnidadeTipoAvaliacao unidadeTipoAvaliacao) {
        return Mono.just(this.unidadeTipoAvaliacaoService.save(unidadeTipoAvaliacao));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<UnidadeTipoAvaliacao> update(@PathVariable final long id, @RequestBody final UnidadeTipoAvaliacao unidadeTipoAvaliacao) {
        return Mono.just(this.unidadeTipoAvaliacaoService.save(id, unidadeTipoAvaliacao));
    }

    @DeleteMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Boolean> delete(@RequestParam long unidadeTipoAvaliacaoId) {
        this.unidadeTipoAvaliacaoService.delete(unidadeTipoAvaliacaoId);
        return Mono.just(true);
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    public Mono<Optional<UnidadeTipoAvaliacao>> findById(@PathVariable final long id) {
        return Mono.just(this.unidadeTipoAvaliacaoService.findById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<Page<UnidadeTipoAvaliacao>> listByFilters(final String defaultFilter, final Long tipoAvaliacaoId, final Long unidadeId, final Boolean ativo) {
        return Mono.just(this.unidadeTipoAvaliacaoService.listByFilters(defaultFilter, tipoAvaliacaoId, unidadeId, ativo, getPageable()));
    }

    @GetMapping("withAvaliaveis")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<Page<UnidadeTipoAvaliacao>> listByFiltersAndWithAvaliaveis(final String defaultFilter, final Long tipoAvaliacaoId, final Long unidadeId, final Boolean ativo, final Long[] idsFilter) {
        return Mono.just(this.unidadeTipoAvaliacaoRepository.listByFiltersAndWithAvaliaveis(defaultFilter, tipoAvaliacaoId, unidadeId, ativo, Utils.getListFromArray(idsFilter), getPageable()));
    }
}
