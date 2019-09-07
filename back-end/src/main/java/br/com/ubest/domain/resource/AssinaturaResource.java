package br.com.ubest.domain.resource;

import br.com.ubest.application.multitenancy.TenantIdentifierResolver;
import br.com.ubest.application.payment.PaymentGatewayConfiguration;
import br.com.ubest.domain.entity.assinatura.Assinatura;
import br.com.ubest.domain.entity.usuario.Perfil;
import br.com.ubest.domain.repository.AssinaturaRepository;
import br.com.ubest.infrastructure.resource.AbstractResource;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping({"**assinatura", "**sistema/assinatura", "**sistema/mobile/assinatura"})
public class AssinaturaResource extends AbstractResource<Assinatura> {

    private final PaymentGatewayConfiguration paymentGatewayConfiguration;

    /**
     *
     */
    private final AssinaturaRepository assinaturaRepository;

    /**
     *
     */
    private final TenantIdentifierResolver tenantIdentifierResolver;

    /**
     * @param assinatura Assinatura
     * @return Mono<Assinatura>
     */
    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Assinatura> save(@RequestBody final Assinatura assinatura) {
        return Mono.just(this.assinaturaRepository.save(assinatura));
    }

    /**
     * @return Mono<Assinatura>
     */
    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Assinatura> getAssinatura() {
        return Mono.just(this.assinaturaRepository.findAssinaturaByTenant(tenantIdentifierResolver.resolveCurrentTenantIdentifier()).stream().findFirst().orElse(new Assinatura()));
    }

    /**
     * @return String
     */
    @GetMapping("public-key")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<String> getPublicKey() {
        return Mono.just(this.paymentGatewayConfiguration.getPublicKey());
    }

}
