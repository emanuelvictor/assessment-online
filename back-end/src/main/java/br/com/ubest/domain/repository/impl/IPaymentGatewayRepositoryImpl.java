package br.com.ubest.domain.repository.impl;

import br.com.moip.Moip;
import br.com.moip.exception.ValidationException;
import br.com.moip.models.NotificationPreferences;
import br.com.moip.models.Setup;
import br.com.ubest.application.tenant.TenantIdentifierResolver;
import br.com.ubest.domain.entity.assinatura.Assinatura;
import br.com.ubest.domain.entity.assinatura.Fatura;
import br.com.ubest.domain.entity.usuario.Conta;
import br.com.ubest.domain.repository.ContaRepository;
import br.com.ubest.infrastructure.payment.IPaymentGatewayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
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
    private final ContaRepository contaRepository;

    /**
     *
     */
    private final TenantIdentifierResolver tenantIdentifierResolver;

    /**
     *
     */
    @Override
    public Fatura execute(final Fatura fatura) {

        final String tenant = tenantIdentifierResolver.resolveCurrentTenantIdentifier();

        final Conta conta = contaRepository.findByEmailIgnoreCase(tenant);

        final Map<String, Object> taxDocument = payloadFactory(
                value("type", fatura.getAssinatura().getSouEmpresa() != null && fatura.getAssinatura().getSouEmpresa() ? "CNPJ" : "CPF"),
                value("number", fatura.getAssinatura().getDocumentoTitular())
        );

        final Map<String, Object> phone = payloadFactory(
                value("countryCode", "55"),
                value("areaCode", fatura.getAssinatura().getCodigoArea()),
                value("number", fatura.getAssinatura().getTelefone())
        );

        final Map<String, Object> shippingAddress = payloadFactory(
                value("city", fatura.getAssinatura().getEndereco().getCidade().getNome()),
                value("district", fatura.getAssinatura().getEndereco().getBairro()),
                value("street", fatura.getAssinatura().getEndereco().getLogradouro()),
                value("streetNumber", fatura.getAssinatura().getEndereco().getNumero()),
                value("state", fatura.getAssinatura().getEndereco().getCidade().getEstado().getUf()),
                value("country", "BRA"),
                value("zipCode", fatura.getAssinatura().getEndereco().getCep())
        );

        final Map<String, Object> customerRequestBody = payloadFactory(
                value("id", fatura.getAssinatura().getPaymentGatewayId()),
                value("ownId", tenant),
                value("fullname", fatura.getAssinatura().getNomeTitular()),
                value("email", conta.getEmail()),
                value("birthDate", fatura.getAssinatura().getDataNascimentoTitular().format(DateTimeFormatter.ISO_DATE)),
                value("taxDocument", taxDocument),
                value("phone", phone),
                value("shippingAddress", shippingAddress)
        );

        final Map<String, Object> subtotals = payloadFactory(
                value("shipping", fatura.getValorComDesconto())
        );

        final Map<String, Object> amount = payloadFactory(
                value("currency", "BRL"),
                value("subtotals", subtotals)
        );

        final List<Map<String, Object>> items = new ArrayList<>();

        fatura.getItems().forEach(item -> {

            final Map<String, Object> product = payloadFactory(
                    value("product", item.getDispositivo().getNome()),
                    value("category", "INTERNET"),
                    value("quantity", 1),
                    value("detail", "Licença para Uso de Software - Ubest Avaliações Online"),
                    value("price", item.getPreco())
            );

            items.add(product);
        });

        final Map<String, Object> customer = payloadFactory(
                value("id", customerRequestBody.get("id"))
        );

        final Map<String, Object> order = payloadFactory(
                value("ownId", tenant),
                value("amount", amount),
                value("items", items),
                value("customer", customer)
        );

        final Map<String, Object> responseCreation = Moip.API.orders().create(order, setup);

        fatura.setOrderId((String) responseCreation.get("id"));

        return fatura;
    }

    /**
     *
     */
    @Override
    public Assinatura createAccount(final Assinatura assinatura) {

        final String tenant = tenantIdentifierResolver.resolveCurrentTenantIdentifier();

        final Conta conta = contaRepository.findByEmailIgnoreCase(tenant);

        try {

            if (!assinatura.isCompleted())
                return assinatura;

            // Se já tiver o gateway id não atualiza
            // A wirecard não provê a funcionalidade de se atualizar o cliente.
            // A não ser que seja através do pedido
            if (assinatura.getPaymentGatewayId() != null)
                return assinatura;

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

            assinatura.setPaymentGatewayId((String) Moip.API.customers().create(customerRequestBody, setup).get("id"));

        } catch (Exception e) {
            if (e instanceof ValidationException)
                if (((ValidationException) e).getErrors().getErrors().stream().anyMatch(error -> error.getPath().equals("customer.ownId"))) {
                    ((ArrayList) Moip.API.customers().list(setup).get("customers")).forEach((o) -> {
                        if (((LinkedHashMap) o).get("ownId").equals(tenant)) {
                            assinatura.setPaymentGatewayId((String) ((LinkedHashMap) o).get("id"));
                        }
                    });
                }

            e.printStackTrace();
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
