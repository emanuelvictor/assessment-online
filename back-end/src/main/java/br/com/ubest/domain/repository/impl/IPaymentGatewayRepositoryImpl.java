package br.com.ubest.domain.repository.impl;

import br.com.moip.Moip;
import br.com.moip.models.NotificationPreferences;
import br.com.moip.models.Setup;
import br.com.ubest.application.tenant.TenantIdentifierResolver;
import br.com.ubest.domain.entity.assinatura.Assinatura;
import br.com.ubest.domain.entity.assinatura.Fatura;
import br.com.ubest.domain.entity.usuario.Conta;
import br.com.ubest.infrastructure.payment.IPaymentGatewayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import static br.com.moip.helpers.PayloadFactory.payloadFactory;
import static br.com.moip.helpers.PayloadFactory.value;

/**
 *
 */
@Component
@RequiredArgsConstructor
public class IPaymentGatewayRepositoryImpl implements IPaymentGatewayRepository {

    /**
     * Cliente com configuração accessToken
     * Autenticação com accessToken
     * Para criação de contas transparentes
     */
    private final Setup setup;

    /**
     *
     */
    private final TenantIdentifierResolver tenantIdentifierResolver;

    /**
     *
     */
    @Override
    public Fatura execute(final Fatura fatura) {

//        Map<String, Object> taxDocument = payloadFactory(
//                value("type", "CPF"),
//                value("number", "33333333333")
//        );
//
//        Map<String, Object> phone = payloadFactory(
//                value("countryCode", "55"),
//                value("areaCode", "11"),
//                value("number", "66778899")
//        );
//
//        Map<String, Object> holder = payloadFactory(
//                value("fullname", "Portador Teste Moip"),
//                value("birthdate", "1988-12-30"),
//                value("taxDocument", taxDocument),
//                value("phone", phone)
//        );
//
//        Map<String, Object> creditCard = payloadFactory(
//                value("hash", "CREDIT_CARD_HASH"),
//                value("store", false),
//                value("holder", holder)
//        );
//
//        Map<String, Object> fundingInstrument = payloadFactory(
//                value("method", "CREDIT_CARD"),
//                value("creditCard", creditCard)
//        );
//
//        Map<String, Object> payment = payloadFactory(
//                value("installmentCount", 1),
//                value("statementDescriptor", "minhaLoja.com"),
//                value("fundingInstrument", fundingInstrument)
//        );
//
//        Map<String, Object> newPay = Moip.API.payments().pay(payment, "order_id", setup);
        return null;
    }
    /**
     *
     */
    @Override
    public Assinatura createAccount(final Assinatura assinatura, final Conta conta) {

        try {

            if (!assinatura.isCompleted())
                return assinatura;

            final String tenant = tenantIdentifierResolver.resolveCurrentTenantIdentifier();

            final Map<String, Object> taxDocument = payloadFactory(
                    value("type", assinatura.getSouEmpresa() != null && assinatura.getSouEmpresa() ? "CNPJ" : "CPF"),
                    value("number", assinatura.getDocumentoTitular())
            );

            final Map<String, Object> phone = payloadFactory(
                    value("countryCode", "55"),
                    value("areaCode", assinatura.getCodigoArea()),
                    value("number", assinatura.getTelefone())
            );

            final Map<String, Object> shippingAddress = payloadFactory(
                    value("city", assinatura.getEndereco().getCidade().getNome()),
                    value("district", assinatura.getEndereco().getBairro()),
                    value("street", assinatura.getEndereco().getLogradouro()),
                    value("streetNumber", assinatura.getEndereco().getNumero()),
                    value("state", assinatura.getEndereco().getCidade().getEstado().getUf()),
                    value("country", "BRA"),
                    value("zipCode", assinatura.getEndereco().getCep())
            );

            final Map<String, Object> customerRequestBody = payloadFactory(
                    value("id", assinatura.getPaymentGatewayId()),
                    value("ownId", tenant),
                    value("fullname", assinatura.getNomeTitular()),
                    value("email", conta.getEmail()),
                    value("birthDate", assinatura.getDataNascimentoTitular().format(DateTimeFormatter.ISO_DATE)),
                    value("taxDocument", taxDocument),
                    value("phone", phone),
                    value("shippingAddress", shippingAddress)
            );

            if (assinatura.getPaymentGatewayId() == null){
//                Moip.API.customers().list(setup);
//                ((ArrayList) Moip.API.customers().list(setup).get("customers")).stream().filter(o -> ((HashMap) o).get("ownId").equals(tenant));]
//                assinatura.setPaymentGatewayId((String) Moip.API.customers().get(tenant, setup).get("id"));
                ((ArrayList) Moip.API.customers().list(setup).get("customers")).stream().forEach(o -> {
                    if (((LinkedHashMap) o).get("ownId").equals(tenant))
                        System.out.println(((LinkedHashMap) o).get("ownId"));
                });
            }

            assinatura.setPaymentGatewayId((String) Moip.API.customers().create(customerRequestBody, setup).get("id"));

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Ops! Existe alguma incompatibilidade entre seus dados e nosso provedor de pagamento. Por favor, verifique e tente novamente.");
        }

        return assinatura;
    }

    /**
     * @param paymentId
     * @return
     */
    public Map<String, Object> findPaymentById(final String paymentId) {
        return Moip.API.payments().get(paymentId, this.setup);
    }

    /**
     * @return
     */
    public NotificationPreferences getNotificationPreferences() {
        return Moip.API.notificationPreferences();
    }
}
