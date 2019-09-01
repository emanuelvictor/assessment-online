package br.com.ubest.domain.resource;

import br.com.ubest.application.multitenancy.TenantIdentifierResolver;
import br.com.ubest.domain.entity.unidade.Licenca;
import br.com.ubest.domain.entity.unidade.UnidadeTipoAvaliacaoLicenca;
import br.com.ubest.domain.entity.usuario.Perfil;
import br.com.ubest.domain.repository.LicencaRepository;
import br.com.ubest.domain.repository.UnidadeTipoAvaliacaoLicencaRepository;
import br.com.ubest.domain.service.LicencaService;
import br.com.ubest.infrastructure.resource.AbstractResource;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;

import static br.com.ubest.infrastructure.suport.Utils.getListFromArray;

@RestController
@RequiredArgsConstructor
@RequestMapping({"**licencas", "**sistema/licencas", "**sistema/mobile/licencas"})
public class LicencaResource extends AbstractResource<Licenca> {

    private final LicencaService licencaService;

    private final LicencaRepository licencaRepository;

    private final TenantIdentifierResolver tenantIdentifierResolver;

    private final UnidadeTipoAvaliacaoLicencaRepository unidadeTipoAvaliacaoLicencaRepository;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    @Transactional
    public Mono<Licenca> save(@RequestBody final Licenca licenca) {
        licenca.setTenant(tenantIdentifierResolver.resolveCurrentTenantIdentifier());
        licenca.getUnidadesTiposAvaliacoesLicenca().forEach(unidadeTipoAvaliacaoLicenca -> unidadeTipoAvaliacaoLicenca.setLicenca(licenca));
        return Mono.just(this.licencaRepository.save(licenca));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Licenca> update(@PathVariable final long id, @RequestBody final Licenca licenca) {
        licenca.setTenant(tenantIdentifierResolver.resolveCurrentTenantIdentifier());
        licenca.setId(id);
        return Mono.just(this.licencaRepository.save(licenca));
    }

    @PutMapping("{id}/unidadesTiposAvaliacoesLicenca")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<List<UnidadeTipoAvaliacaoLicenca>> saveUnidadesTiposAvaliacoesLicenca(@PathVariable final long id, @RequestBody final UnidadeTipoAvaliacaoLicenca[] unidadesTiposAvaliacoesLicenca) {
        final List<UnidadeTipoAvaliacaoLicenca> unidadeTipoAvaliacaoLicencas = getListFromArray(unidadesTiposAvaliacoesLicenca);
        unidadeTipoAvaliacaoLicencas.forEach(unidadeTipoAvaliacaoLicenca -> unidadeTipoAvaliacaoLicenca.setLicenca(new Licenca(id)));
        return Mono.just(this.unidadeTipoAvaliacaoLicencaRepository.saveAll(unidadeTipoAvaliacaoLicencas));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Boolean> delete(@PathVariable long id) {
        this.licencaRepository.deleteById(id);
        return Mono.just(true);
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    public Mono<Optional<Licenca>> findById(@PathVariable final long id) {
        return Mono.just(this.licencaRepository.findById(id));
    }


    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<Page<Licenca>> listByFilters(final String defaultFilter) {
        return Mono.just(this.licencaService.listByFilters(defaultFilter, getPageable()));
    }

    /**
     * Lista todas as licenças pelo id do usuário.
     *
     * @param usuarioId {long}
     * @return Mono<List < Unidade>>
     */
    @GetMapping("by-usuario") //TODO gambitinho
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<List<Licenca>> listByUsuarioId(@RequestParam final long usuarioId) {
        return Mono.just(this.licencaRepository.listByUsuarioId(usuarioId));
    }

    @GetMapping("authenticate/{licencaId}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    Mono<Boolean> authenticateByLicencaId(@PathVariable final long licencaId, @RequestParam final String password) {
        return Mono.just(this.licencaService.authenticateByLicencaId(licencaId, password));
    }

    @GetMapping("{licencaId}/hashs")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    Mono<List<String>> getHashsByLicencaId(@PathVariable final long licencaId) {
        return Mono.just(this.licencaService.getHashsByLicencaId(licencaId));
    }
}
