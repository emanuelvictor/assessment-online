package br.com.ubest.application.resource;

import br.com.ubest.application.tenant.TenantIdentifierResolver;
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
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import static br.com.ubest.infrastructure.suport.Utils.getListFromArray;

@RestController
@RequiredArgsConstructor
@RequestMapping({"**dispositivos", "**public/dispositivos", "**sistema/dispositivos", "**sistema/mobile/dispositivos"})
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
    private final UnidadeTipoAvaliacaoDispositivoRepository unidadeTipoAvaliacaoDispositivoRepository;

    /**
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
     * @param id
     * @param dispositivo
     * @return
     */
    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Dispositivo> update(@PathVariable final long id, @RequestBody final Dispositivo dispositivo) {
        dispositivo.setId(id);

        dispositivo.getUnidadesTiposAvaliacoesDispositivo().forEach(unidadeTipoAvaliacaoDispositivo -> unidadeTipoAvaliacaoDispositivo.setDispositivo(dispositivo));

        this.dispositivoService.save(dispositivo);

        return Mono.just(dispositivo);
    }

    /**
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
     * @param id
     * @param numeroSerie
     * @return
     */
    @GetMapping("{id}")
    Mono<Optional<Dispositivo>> getDispositivo(@PathVariable final String id/*, @RequestParam(required = false) final String numeroSerie*/) {
        try {
            return Mono.just(Optional.of(this.dispositivoService.getDispositivo(Long.parseLong(id))));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    /**
     * @param dispositivo
     * @param exchange
     * @return
     */
    @PostMapping("authenticate-by-codigo")
    Mono<Optional<Dispositivo>> authenticateByCodigo(@RequestBody final Dispositivo dispositivo, final ServerWebExchange exchange) {
        return Mono.just(Optional.of(this.dispositivoService.authenticate(dispositivo.getNumeroSerie(), dispositivo.getCodigo(), exchange)));
    }

    /**
     * @param numeroSerie
     * @return
     */
    @GetMapping("{numeroSerie}/desvincular")
    @PreAuthorize("hasAnyAuthority('" + Perfil.DISPOSITIVO_VALUE + "')")
    Mono<Optional<Dispositivo>> desvincular(@PathVariable final String numeroSerie) {
        return Mono.just(Optional.of(this.dispositivoService.desvincular(numeroSerie)));
    }


    /**
     * Gera o qrcode
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "{id}/qrcode", method = RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQRCode(@PathVariable final long id) {

        final Dispositivo dispositivo = this.dispositivoService.getDispositivo(id);

        Assert.notNull(dispositivo, "Dispositivo não encontrado");

        try {
            return ResponseEntity.ok().cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
                    .body(dispositivoService.generateQRCodeAsync(String.valueOf(dispositivo.getCodigo()), 256, 256).get());

        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();

            return null;
        }
    }

}
