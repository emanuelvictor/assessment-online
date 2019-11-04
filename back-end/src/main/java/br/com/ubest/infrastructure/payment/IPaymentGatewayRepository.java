package br.com.ubest.infrastructure.payment;

import br.com.ubest.domain.entity.assinatura.Assinatura;
import br.com.ubest.domain.entity.assinatura.fatura.Fatura;

/**
 * @author Emanuel Victor
 */
public interface IPaymentGatewayRepository {

    /**
     *
     * @param fatura
     * @return
     */
    Fatura fecharFatura(final Fatura fatura);

    /**
     *
     * @param fatura
     * @return
     */
    Fatura executarFatura(final Fatura fatura);

    /**
     *
     * @param assinatura
     * @return
     */
	Assinatura createAccount(final Assinatura assinatura);

//	/**
//	 *
//	 * @return
//	 */
//	List<NotificationPreferences> getNotificationPreferences();
//
//	/**
//	 *
//	 * @param paymentId
//	 * @return
//	 */
//	Payments findPaymentByPaymentId(final String paymentId);
}
