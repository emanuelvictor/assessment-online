package br.com.ubest.infrastructure.payment;

import br.com.ubest.domain.entity.assinatura.Assinatura;
import br.com.ubest.domain.entity.assinatura.Fatura;
import br.com.ubest.domain.entity.usuario.Conta;

/**
 * @author Emanuel Victor
 */
public interface IPaymentGatewayRepository {

    /**
     * @param fatura
     * @return
     */
    Fatura execute(final Fatura fatura);

    /**
     * @param assinatura
     * @return
     */
	Assinatura createAccount(final Assinatura assinatura);


    /**
     * @param assinatura
     * @return
     */
    Assinatura createBankAccount(final Assinatura assinatura);

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
