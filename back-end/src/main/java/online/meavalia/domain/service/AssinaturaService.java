package online.meavalia.domain.service;

import online.meavalia.application.payment.PaymentGatewayConfiguration;
import online.meavalia.domain.repository.AssinaturaRepository;
import online.meavalia.domain.entity.assinatura.Assinatura;
import online.meavalia.infrastructure.payment.IPaymentGatewayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
     * @return Mono<Assinatura>
     */
    public Assinatura getAssinatura() {
        return this.assinaturaRepository.findAll().stream().findFirst().orElse(new Assinatura());
    }

    /**
     * @return String
     */
    public String getPublicKey() {
        return this.paymentGatewayConfiguration.getPublicKey();
    }

}
