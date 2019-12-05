package online.meavalia.application.resource;

import online.meavalia.domain.entity.assinatura.Assinatura;
import online.meavalia.domain.entity.usuario.Perfil;
import online.meavalia.domain.service.AssinaturaService;
import online.meavalia.infrastructure.resource.AbstractResource;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

/**
 * @author Emanuel Victor
 * @version 1.0.0
 * @since 1.0.0, 10/09/2019
 */
@RestController
@RequiredArgsConstructor
@RequestMapping({"**assinatura", "**public/assinatura", "**sistema/assinatura", "**sistema/mobile/assinatura"})
public class AssinaturaResource extends AbstractResource<Assinatura> {

    /**
     *
     */
    private final AssinaturaService assinaturaService;

    /**
     * @param id         Long
     * @param assinatura Assinatura
     * @return @Link Mono<Assinatura>
     */
    @Transactional
    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Assinatura> save(@PathVariable("id") long id, @RequestBody final Assinatura assinatura) {
        assinatura.setId(id);
        return Mono.just(this.assinaturaService.save(assinatura));
    }

    /**
     * @return Mono<Assinatura>
     */
    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Assinatura> getAssinatura() {
        return Mono.just(this.assinaturaService.getAssinatura());
    }

    /**
     * @return String
     */
    @GetMapping("public-key")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<String> getPublicKey() {
        return Mono.just(this.assinaturaService.getPublicKey());
    }

}
