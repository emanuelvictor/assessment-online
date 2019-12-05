package online.meavalia.infrastructure.payment;

import online.meavalia.domain.entity.assinatura.fatura.Fatura;
import online.meavalia.domain.entity.assinatura.Assinatura;

import java.util.List;
import java.util.Map;

/**
 * @author Emanuel Victor
 */
public interface IPaymentGatewayRepository {

    /**
     * @param fatura
     * @return
     */
    Fatura fecharFatura(final Fatura fatura);

    /**
     * @param fatura
     * @return
     */
    Fatura executarFatura(final Fatura fatura);

    /**
     * @param assinatura
     * @return
     */
    Assinatura createAccount(final Assinatura assinatura);

    /**
     * @return
     */
    Map<String, Object> getNotificationPreferenceById(final String notificationPreferenceId);

    /**
     * @return
     */
    List<Map<String, Object>> getNotificationPreferences();

//
//	/**
//	 *
//	 * @param paymentId
//	 * @return
//	 */
//	Payments findPaymentByPaymentId(final String paymentId);
}
