package online.meavalia.application.resource;

import lombok.RequiredArgsConstructor;
import online.meavalia.application.tenant.TenantIdentifierResolver;
import online.meavalia.domain.entity.unidade.Dispositivo;
import online.meavalia.domain.entity.unidade.UnidadeTipoAvaliacaoDispositivo;
import online.meavalia.domain.entity.usuario.Perfil;
import online.meavalia.domain.repository.AssinaturaRepository;
import online.meavalia.domain.service.DispositivoService;
import online.meavalia.infrastructure.resource.AbstractResource;
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
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import static online.meavalia.infrastructure.suport.Utils.getSetFromArray;

@RestController
@RequiredArgsConstructor
@RequestMapping({"**dispositivos", "**public/dispositivos", "**sistema/dispositivos", "**sistema/mobile/dispositivos"})
public class DispositivoResource extends AbstractResource<Dispositivo> {

    /**
     *
     */
    private final DispositivoService dispositivoService;

    /**
     * @param dispositivo
     * @return
     */
    @PostMapping
    @Transactional
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Dispositivo> save(@RequestBody final Dispositivo dispositivo) {
        dispositivo.getUnidadesTiposAvaliacoesDispositivo().forEach(unidadeTipoAvaliacaoDispositivo -> unidadeTipoAvaliacaoDispositivo.setDispositivo(dispositivo));
//        dispositivo.setAssinatura(this.assinaturaRepository.findAll().stream().findFirst().orElse(new Assinatura()));
        return Mono.just(this.dispositivoService.insertDispositivo(dispositivo));
    }

    /**
     * @param id
     * @param dispositivo
     * @return
     */
    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Dispositivo> update(@PathVariable final long id, @RequestBody final Dispositivo dispositivo) {

        dispositivo.getUnidadesTiposAvaliacoesDispositivo().forEach(unidadeTipoAvaliacaoDispositivo -> unidadeTipoAvaliacaoDispositivo.setDispositivo(dispositivo));

        this.dispositivoService.updateDispositivo(id, dispositivo);

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
        return Mono.just(dispositivoService.saveUnidadesTiposAvaliacoesDispositivo(id, getSetFromArray(unidadesTiposAvaliacoesDispositivo)));
    }
//
//    /**
//     * @param id
//     * @return
//     */
//    @DeleteMapping("{id}")
//    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
//    public Mono<Boolean> delete(@PathVariable long id) {
//        this.dispositivoRepository.deleteById(id);
//        return Mono.just(true);
//    }

    /**
     * @param defaultFilter
     * @return
     */
    @GetMapping
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<Page<Dispositivo>> listByFilters(final String defaultFilter) {
        return Mono.just(this.dispositivoService.listDispositivosByFilters(defaultFilter, getPageable()));
    }

    /**
     * @param id
     * @return
     */
    @GetMapping("{id}")
    Mono<Optional<Dispositivo>> getDispositivo(@PathVariable final String id) {
        try {
            return Mono.just(Optional.of(this.dispositivoService.getDispositivoByIdOrCodigo(Long.parseLong(id))));
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
     * @param id
     * @return
     */
    @GetMapping("{id}/update-status-ativo")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Dispositivo> updateStatusAtivo(@PathVariable final long id) {
        return Mono.just(this.dispositivoService.updateStatusAtivo(id));
    }

    /**
     * @param id
     * @return
     */
    @GetMapping("{id}/refresh-codigo")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Dispositivo> refreshCodigo(@PathVariable final long id) {
        return Mono.just(this.dispositivoService.refreshCodigo(id));
    }

    /**
     * @param numeroSerie
     * @return
     */
    @GetMapping("{numeroSerie}/desvincular")
    @PreAuthorize("hasAnyAuthority('" + Perfil.DISPOSITIVO_VALUE + "')")
    Mono<Dispositivo> desvincular(@PathVariable final String numeroSerie) {
        final Dispositivo dispositivo = this.dispositivoService.updateDispositivoAndRemoveNumeroSerie(numeroSerie);
        if (dispositivo != null)
            return Mono.just(dispositivo);
        return Mono.empty();
    }


    /**
     * Gera o qrcode
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "{id}/qrcode", method = RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQRCode(@PathVariable final long id) {

        final Dispositivo dispositivo = this.dispositivoService.getDispositivoByIdOrCodigo(id);

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
