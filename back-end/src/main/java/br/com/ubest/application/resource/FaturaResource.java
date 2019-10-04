package br.com.ubest.application.resource;

import br.com.ubest.application.payment.PaymentGatewayConfiguration;
import br.com.ubest.domain.entity.assinatura.Assinatura;
import br.com.ubest.domain.entity.assinatura.Fatura;
import br.com.ubest.domain.entity.usuario.Perfil;
import br.com.ubest.domain.repository.AssinaturaRepository;
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
@RequestMapping({"**fatura", "**sistema/fatura", "**sistema/mobile/fatura"})
public class FaturaResource extends AbstractResource<Fatura> {


}
