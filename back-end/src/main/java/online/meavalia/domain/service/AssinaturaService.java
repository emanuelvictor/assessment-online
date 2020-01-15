package online.meavalia.domain.service;

import lombok.RequiredArgsConstructor;
import online.meavalia.application.payment.PaymentGatewayConfiguration;
import online.meavalia.domain.entity.assinatura.Assinatura;
import online.meavalia.domain.entity.assinatura.Cupom;
import online.meavalia.domain.repository.AssinaturaRepository;
import online.meavalia.infrastructure.payment.IPaymentGatewayRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.math.BigDecimal;

/**
 * @author Emanuel Victor
 * @version 1.0.0
 * @since 1.0.0, 10/09/2019
 */
@Service
@RequiredArgsConstructor
public class AssinaturaService {

    /**
     *
     */
    private final CupomService cupomService;

    /**
     *
     */
    private final AssinaturaRepository assinaturaRepository;

    /**
     *
     */
    private final IPaymentGatewayRepository paymentGatewayRepository;

    /**
     *
     */
    private final PaymentGatewayConfiguration paymentGatewayConfiguration;


    /**
     * @param assinatura Assinatura
     * @return @Link Mono<Assinatura>
     */
    @Transactional
    public Assinatura save(final Assinatura assinatura) {

        if (assinatura.getEndereco().getCidade() != null && assinatura.getEndereco().getCidade().getId() == null)
            assinatura.getEndereco().setCidade(null);

        // Salvo na wirecard
        assinatura.setClientId(paymentGatewayRepository.createAccount(assinatura).getClientId());

        return this.assinaturaRepository.save(assinatura);

    }

    /**
     * @return String
     */
    public String getPublicKey() {
        return this.paymentGatewayConfiguration.getPublicKey();
    }

    /**
     * @return Mono<Assinatura>
     */
    public Assinatura getAssinatura() {
        return this.assinaturaRepository.findAll().stream().findFirst().orElse(new Assinatura());
    }

    /**
     * @return
     */
    public BigDecimal getValorMensalComDesconto() {

        final Assinatura assinatura = this.getAssinatura();
        Assert.isTrue(assinatura != null && assinatura.isCompleted(), "Complete sua assinatura");

        final Cupom cupom = cupomService.getCupomByCurrentTenant();
        if (cupom == null)
            return assinatura.getPlano().getValorMensal();
        else
            return assinatura.getPlano().getValorMensal().subtract(assinatura.getPlano().getValorMensal().multiply(cupomService.getCupomByCurrentTenant().getPercentualDesconto().multiply(new BigDecimal(0.01))));

    }
}
