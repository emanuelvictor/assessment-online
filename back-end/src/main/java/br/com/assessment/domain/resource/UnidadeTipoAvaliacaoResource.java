package br.com.assessment.domain.resource;

import br.com.assessment.domain.entity.avaliacao.TipoAvaliacao;
import br.com.assessment.domain.entity.avaliacao.UnidadeTipoAvaliacao;
import br.com.assessment.domain.entity.usuario.Perfil;
import br.com.assessment.domain.service.TipoAvaliacaoService;
import br.com.assessment.domain.service.UnidadeTipoAvaliacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Optional;

import static br.com.assessment.application.context.LocalContext.getPageable;
import static br.com.assessment.infrastructure.util.ArrayUtil.getListFromArray;

@RestController
@RequiredArgsConstructor
@RequestMapping({"**unidade-tipos-avaliacoes", "**sistema/unidade-tipos-avaliacoes", "**sistema/mobile/unidade-tipos-avaliacoes"})
public class UnidadeTipoAvaliacaoResource {

    private final UnidadeTipoAvaliacaoService unidadeTipoAvaliacaoService;

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
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    Mono<Page<UnidadeTipoAvaliacao>> listByFilters(final String defaultFilter) {
        return Mono.just(this.unidadeTipoAvaliacaoService.listByFilters(defaultFilter, getPageable()));
    }
}