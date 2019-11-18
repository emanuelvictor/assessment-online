package online.meavalia.application.resource;

import online.meavalia.application.tenant.TenantIdentifierResolver;
import online.meavalia.domain.entity.assinatura.Assinatura;
import online.meavalia.domain.entity.assinatura.fatura.Fatura;
import online.meavalia.domain.service.FaturaService;
import online.meavalia.infrastructure.resource.AbstractResource;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

/**
 * @author Emanuel Victor
 * @version 1.0.0
 * @since 1.0.0, 10/09/2019
 */
@RestController
@RequiredArgsConstructor
@RequestMapping({"**notifications", "**public/notifications", "**sistema/notifications", "**sistema/mobile/notifications"})
public class NotificationResource extends AbstractResource<Assinatura> {

    /**
     *
     */
    private final FaturaService faturaService;

    /**
     *
     */
    private final TenantIdentifierResolver tenantIdentifierResolver;

    /**
     * @param notification
     * @return
     */
    @PostMapping("payments")
    public Mono<Fatura> updatePayment(@RequestHeader(value = "Authorization") final String authentication, @RequestBody final Object notification) {

        final Fatura fatura = faturaService.updatePaymentByNotification(authentication, notification);

        tenantIdentifierResolver.setSchema(fatura.getTenant());

        return Mono.just(faturaService.verifyInativos(fatura));
    }

    /**
     * @param authentication
     * @param notification
     * @return
     */
    @PostMapping("orders")
    public Mono<Fatura> updateOrder(@RequestHeader(value = "Authorization") final String authentication, @RequestBody final Object notification) {

        final Fatura fatura = faturaService.updateOrderByNotification(authentication, notification);

        tenantIdentifierResolver.setSchema(fatura.getTenant());

        return Mono.just(faturaService.verifyInativos(fatura));
    }

}
