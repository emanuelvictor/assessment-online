package br.com.ubest.application.resource;

import br.com.ubest.application.multitenancy.TenantIdentifierResolver;
import br.com.ubest.application.websocket.WrapperHandler;
import br.com.ubest.domain.entity.assinatura.Assinatura;
import br.com.ubest.domain.entity.unidade.Dispositivo;
import br.com.ubest.domain.entity.unidade.UnidadeTipoAvaliacaoDispositivo;
import br.com.ubest.domain.entity.usuario.Perfil;
import br.com.ubest.domain.repository.AssinaturaRepository;
import br.com.ubest.domain.repository.DispositivoRepository;
import br.com.ubest.domain.repository.UnidadeTipoAvaliacaoDispositivoRepository;
import br.com.ubest.domain.service.DispositivoService;
import br.com.ubest.infrastructure.resource.AbstractResource;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static br.com.ubest.infrastructure.suport.Utils.getListFromArray;

@RestController
@RequiredArgsConstructor
@RequestMapping({"**dispositivos", "**sistema/dispositivos", "**sistema/mobile/dispositivos"})
public class DispositivoResource extends AbstractResource<Dispositivo> {

    /**
     *
     */
    private final AssinaturaRepository assinaturaRepository;

    /**
     *
     */
    private final DispositivoService dispositivoService;

    /**
     *
     */
    private final DispositivoRepository dispositivoRepository;

    /**
     *
     */
    private final TenantIdentifierResolver tenantIdentifierResolver;

    /**
     *
     */
    private final List<WrapperHandler<Dispositivo>> dispositivosWrapperHandler;

    /**
     *
     */
    private final UnidadeTipoAvaliacaoDispositivoRepository unidadeTipoAvaliacaoDispositivoRepository;

    /**
     *
     * @param dispositivo
     * @return
     */
    @PostMapping
    @Transactional
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Dispositivo> save(@RequestBody final Dispositivo dispositivo) {
        dispositivo.setTenant(tenantIdentifierResolver.resolveCurrentTenantIdentifier());
        dispositivo.getUnidadesTiposAvaliacoesDispositivo().forEach(unidadeTipoAvaliacaoDispositivo -> unidadeTipoAvaliacaoDispositivo.setDispositivo(dispositivo));
        dispositivo.setAssinatura(this.assinaturaRepository.findAll().stream().findFirst().orElse(new Assinatura()));
        return Mono.just(this.dispositivoRepository.save(dispositivo));
    }

    /**
     *
     * @param id
     * @param dispositivo
     * @return
     */
    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Dispositivo> update(@PathVariable final long id, @RequestBody final Dispositivo dispositivo) {
        dispositivo.setId(id);

        dispositivo.getUnidadesTiposAvaliacoesDispositivo().forEach(unidadeTipoAvaliacaoDispositivo -> unidadeTipoAvaliacaoDispositivo.setDispositivo(dispositivo));

        saveInner(dispositivo);

        dispositivosWrapperHandler.stream().filter(t -> t.getResourceId().equals(dispositivo.getNumeroLicenca())).findFirst().ifPresent(
                t -> t.getMessagePublisher().onNext(dispositivo)
        );

        return Mono.just(dispositivo);
    }

    /**
     *
     * @param dispositivo
     */
    @Transactional
    void saveInner(final Dispositivo dispositivo) {
        this.dispositivoRepository.save(dispositivo);
    }

    /**
     *
     * @param id
     * @param unidadesTiposAvaliacoesDispositivo
     * @return
     */
    @PutMapping("{id}/unidadesTiposAvaliacoesDispositivo")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<List<UnidadeTipoAvaliacaoDispositivo>> saveUnidadesTiposAvaliacoesDispositivo(@PathVariable final long id, @RequestBody final UnidadeTipoAvaliacaoDispositivo[] unidadesTiposAvaliacoesDispositivo) {
        final List<UnidadeTipoAvaliacaoDispositivo> unidadeTipoAvaliacaoDispositivos = getListFromArray(unidadesTiposAvaliacoesDispositivo);
        Objects.requireNonNull(unidadeTipoAvaliacaoDispositivos).forEach(unidadeTipoAvaliacaoDispositivo -> unidadeTipoAvaliacaoDispositivo.setDispositivo(new Dispositivo(id)));
        return Mono.just(this.unidadeTipoAvaliacaoDispositivoRepository.saveAll(unidadeTipoAvaliacaoDispositivos));
    }

    /**
     *
     * @param id
     * @return
     */
    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Boolean> delete(@PathVariable long id) {
        this.dispositivoRepository.deleteById(id);
        return Mono.just(true);
    }

    /**
     *
     * @param id
     * @return
     */
    @GetMapping("{id}")
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    public Mono<Optional<Dispositivo>> findById(@PathVariable final long id) {
        return Mono.just(Optional.of(this.dispositivoRepository.findById(id).orElse(this.dispositivoRepository.findByNumeroLicenca(id).get())));
    }

    /**
     *
     * @param defaultFilter
     * @return
     */
    @GetMapping
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<Page<Dispositivo>> listByFilters(final String defaultFilter) {
        return Mono.just(this.dispositivoService.listByFilters(defaultFilter, getPageable()));
    }

    /**
     * Lista todas as dispositivos pelo id do usuário.
     *
     * @param usuarioId {long}
     * @return Mono<List < Unidade>>
     */
    @GetMapping("by-usuario") //TODO gambitinho
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<List<Dispositivo>> listByUsuarioId(@RequestParam final long usuarioId) {
        return Mono.just(this.dispositivoRepository.listByUsuarioId(usuarioId));
    }

    @Transactional(readOnly = true)
    @GetMapping("authenticate/{dispositivoId}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    Mono<Boolean> authenticateByDispositivoId(@PathVariable final long dispositivoId, @RequestParam final String password) {
        return Mono.just(this.dispositivoService.authenticateByDispositivoId(dispositivoId, password));
    }

    @Transactional(readOnly = true)
    @GetMapping("{dispositivoId}/hashs")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    Mono<List<String>> getHashsByDispositivoId(@PathVariable final long dispositivoId) {
        return Mono.just(this.dispositivoService.getHashsByDispositivoId(dispositivoId));
    }
}
