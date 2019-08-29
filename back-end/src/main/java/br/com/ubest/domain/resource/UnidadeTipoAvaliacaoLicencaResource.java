package br.com.ubest.domain.resource;

import br.com.ubest.domain.entity.unidade.UnidadeTipoAvaliacaoLicenca;
import br.com.ubest.domain.entity.usuario.Perfil;
import br.com.ubest.domain.repository.UnidadeTipoAvaliacaoLicencaRepository;
import br.com.ubest.infrastructure.resource.AbstractResource;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping({"**unidades-tipos-avaliacoes-licenca", "**sistema/unidades-tipos-avaliacoes-licenca", "**sistema/mobile/unidades-tipos-avaliacoes-licenca"})
public class UnidadeTipoAvaliacaoLicencaResource extends AbstractResource<UnidadeTipoAvaliacaoLicenca> {

    private final UnidadeTipoAvaliacaoLicencaRepository unidadeTipoAvaliacaoLicencaRepository;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<UnidadeTipoAvaliacaoLicenca> save(@RequestBody final UnidadeTipoAvaliacaoLicenca unidadeTipoAvaliacaoLicenca) {
        return Mono.just(this.unidadeTipoAvaliacaoLicencaRepository.save(unidadeTipoAvaliacaoLicenca));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<UnidadeTipoAvaliacaoLicenca> update(@PathVariable final long id, @RequestBody final UnidadeTipoAvaliacaoLicenca unidadeTipoAvaliacaoLicenca) {
        unidadeTipoAvaliacaoLicenca.setId(id);
        return Mono.just(this.unidadeTipoAvaliacaoLicencaRepository.save(unidadeTipoAvaliacaoLicenca));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Boolean> delete(@PathVariable final long id) {
        this.unidadeTipoAvaliacaoLicencaRepository.deleteById(id);
        return Mono.just(true);
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    public Mono<Optional<UnidadeTipoAvaliacaoLicenca>> findById(@PathVariable final long id) {
        return Mono.just(this.unidadeTipoAvaliacaoLicencaRepository.findById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<Page<UnidadeTipoAvaliacaoLicenca>> listByFilters(final String defaultFilter, final Long licencaId, final Long unidadeTipoAvaliacaoId, final Boolean ativo) {
        return Mono.just(this.unidadeTipoAvaliacaoLicencaRepository.listByFilters(defaultFilter, licencaId, unidadeTipoAvaliacaoId, ativo, getPageable()));
    }

}
