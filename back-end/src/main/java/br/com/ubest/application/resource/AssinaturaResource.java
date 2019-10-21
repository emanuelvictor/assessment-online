package br.com.ubest.application.resource;

import br.com.ubest.application.payment.PaymentGatewayConfiguration;
import br.com.ubest.domain.entity.assinatura.Assinatura;
import br.com.ubest.domain.entity.usuario.Perfil;
import br.com.ubest.domain.repository.AssinaturaRepository;
import br.com.ubest.infrastructure.payment.IPaymentGatewayRepository;
import br.com.ubest.infrastructure.resource.AbstractResource;
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
@RequestMapping({"**assinatura", "**sistema/assinatura", "**sistema/mobile/assinatura"})
public class AssinaturaResource extends AbstractResource<Assinatura> {

    /**
     *
     */
    private final AssinaturaRepository assinaturaRepository;

    /**
     * TODO mudar o nome da classe
     */
    private final IPaymentGatewayRepository gatewayPaymentRepository;

    /**
     *
     */
    private final PaymentGatewayConfiguration paymentGatewayConfiguration;

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
        if (assinatura.getEndereco().getCidade() != null && assinatura.getEndereco().getCidade().getId() == null)
            assinatura.getEndereco().setCidade(null);

        // Salvo na wirecard
        assinatura.setPaymentGatewayId(gatewayPaymentRepository.createAccount(assinatura).getPaymentGatewayId());

        return Mono.just(this.assinaturaRepository.save(assinatura));
    }

    /**
     * @return Mono<Assinatura>
     */
    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Assinatura> getAssinatura() {
        return Mono.just(this.assinaturaRepository.findAll().stream().findFirst().orElse(new Assinatura()));
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
