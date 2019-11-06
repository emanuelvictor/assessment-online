package br.com.ubest.application.resource;

import br.com.ubest.domain.entity.assinatura.Assinatura;
import br.com.ubest.domain.entity.assinatura.fatura.Fatura;
import br.com.ubest.domain.service.FaturaService;
import br.com.ubest.infrastructure.payment.IPaymentGatewayRepository;
import br.com.ubest.infrastructure.resource.AbstractResource;
import lombok.RequiredArgsConstructor;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

/**
 * @author Emanuel Victor
 * @version 1.0.0
 * @since 1.0.0, 10/09/2019
 */
@RestController
@RequiredArgsConstructor
@RequestMapping({"**notifications", "**sistema/notifications", "**sistema/mobile/notifications"})
public class NotificationResource extends AbstractResource<Assinatura> {

    /**
     *
     */
    private final IPaymentGatewayRepository paymentGatewayRepository;

    private final FaturaService faturaService;

    /**
     * @param notification
     * @return
     */
    @PostMapping
    public Mono<Fatura> save(@RequestHeader(value = "Authorization") String authentication, @RequestBody(required = false) Object notification) {

        return Mono.just(faturaService.updateByNotification(authentication, notification));
    }


}
