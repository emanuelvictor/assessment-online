package online.meavalia.domain.repository.impl;

import br.com.moip.Moip;
import br.com.moip.exception.ValidationException;
import br.com.moip.models.Setup;
import lombok.RequiredArgsConstructor;
import online.meavalia.application.tenant.TenantIdentifierResolver;
import online.meavalia.domain.entity.assinatura.Assinatura;
import online.meavalia.domain.entity.assinatura.FormaPagamento;
import online.meavalia.domain.entity.assinatura.fatura.Fatura;
import online.meavalia.domain.entity.usuario.Conta;
import online.meavalia.domain.repository.ContaRepository;
import online.meavalia.infrastructure.payment.IPaymentGatewayRepository;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.*;

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
    public Fatura executarFatura(final Fatura fatura) {

        if (!fatura.getAssinatura().isCompleted())
            throw new RuntimeException("A assinatura está incompleta!");

        final Map<String, Object> fundingInstrument;

        if (fatura.getAssinatura().getFormaPagamento().equals(FormaPagamento.BOLETO)) {

            final Map<String, Object> boleto = payloadFactory(
                    value("expirationDate", fatura.getDataVencimento().format(DateTimeFormatter.ISO_DATE))
            );

            fundingInstrument = payloadFactory(
                    value("method", "BOLETO"),
                    value("boleto", boleto)
            );
        } else { //TODO

            final Map<String, Object> taxDocument = payloadFactory(
                    value("type", fatura.getAssinatura().getSouEmpresa() != null && fatura.getAssinatura().getSouEmpresa() ? "CNPJ" : "CPF"),
                    value("number", fatura.getAssinatura().getDocumentoTitular())
            );

            final Map<String, Object> phone = payloadFactory(
                    value("countryCode", "55"),
                    value("areaCode", fatura.getAssinatura().getCodigoArea().toString()),
                    value("number", fatura.getAssinatura().getTelefone().toString())
            );

            final Map<String, Object> holder = payloadFactory(
                    value("fullname", fatura.getAssinatura().getNomeTitular()),
                    value("birthdate", fatura.getAssinatura().getDataNascimentoTitular().format(DateTimeFormatter.ISO_DATE)),
                    value("taxDocument", taxDocument),
                    value("phone", phone)
            );

            final Map<String, Object> creditCard = payloadFactory(
                    value("hash", fatura.getAssinatura().getHash()),
                    value("holder", holder)
            );

            fundingInstrument = payloadFactory(
                    value("method", "CREDIT_CARD"),
                    value("creditCard", creditCard)
            );
        }

        final Map<String, Object> payment = payloadFactory(
                value("fundingInstrument", fundingInstrument)
        );

        final Map<String, Object> newPay = Moip.API.payments().pay(payment, fatura.getOrderId(), setup);

        fatura.setPaymentId((String) newPay.get("id"));
        if (fatura.getAssinatura().getFormaPagamento().equals(FormaPagamento.BOLETO))
            fatura.setLinkBoleto((String) ((HashMap) ((HashMap) newPay.get("_links")).get("payBoleto")).get("printHref"));

        return fatura;
    }

    /**
     *
     */
    @Override
    public Fatura fecharFatura(final Fatura fatura) {

        if (!fatura.getAssinatura().isCompleted())
            throw new RuntimeException("A assinatura está incompleta!");

        final Conta conta = contaRepository.findByEmailIgnoreCase(fatura.getTenant());

        final Map<String, Object> taxDocument = payloadFactory(
                value("type", fatura.getAssinatura().getSouEmpresa() != null && fatura.getAssinatura().getSouEmpresa() ? "CNPJ" : "CPF"),
                value("number", fatura.getAssinatura().getDocumentoTitular())
        );

        final Map<String, Object> phone = payloadFactory(
                value("countryCode", "55"),
                value("areaCode", fatura.getAssinatura().getCodigoArea().toString()),
                value("number", fatura.getAssinatura().getTelefone().toString())
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
                value("id", fatura.getAssinatura().getClientId()),
                value("ownId", fatura.getTenant()),
                value("fullname", fatura.getAssinatura().getNomeTitular()),
                value("email", conta.getEmail()),
                value("birthDate", fatura.getAssinatura().getDataNascimentoTitular().format(DateTimeFormatter.ISO_DATE)),
                value("taxDocument", taxDocument),
                value("phone", phone),
                value("shippingAddress", shippingAddress)
        );

        final Map<String, Object> subtotals = payloadFactory(
                value("discount", fatura.getValorDeDesconto().setScale(2, BigDecimal.ROUND_HALF_EVEN).toString().replace(".", ""))
        );

        final Map<String, Object> amount = payloadFactory(
                value("currency", "BRL")
                , value("subtotals", subtotals)
        );

        final List<Map<String, Object>> itens = new ArrayList<>();

        fatura.getItens().forEach(item -> {

            final Map<String, Object> product = payloadFactory(
                    value("product", item.getDispositivo().getNome()),
                    value("quantity", 1),
                    value("detail", "Licença para Uso de Software - MEAvalia!"),
                    value("price", item.getPrecoComAcressimo().setScale(2, BigDecimal.ROUND_HALF_EVEN).toString().replace(".", ""))
            );

            itens.add(product);
        });

//        final Map<String, Object> customer = payloadFactory(
//                value("id", customerRequestBody.get("id"))
//        );

        final Map<String, Object> order = payloadFactory(
                value("ownId", fatura.getId()),
                value("amount", amount),
                value("items", itens),
                value("customer", customerRequestBody)
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

        if (!assinatura.isCompleted())
            return assinatura;

        // Se já tiver o gateway id não atualiza
        // A wirecard não provê a funcionalidade de se atualizar o cliente.
        // A não ser que seja através do pedido
        if (assinatura.getClientId() != null)
            return assinatura;

        final String tenant = tenantIdentifierResolver.resolveCurrentTenantIdentifier();

        final Conta conta = contaRepository.findByEmailIgnoreCase(tenant);

        try {

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
                    value("id", assinatura.getClientId()),
                    value("ownId", tenant),
                    value("fullname", assinatura.getNomeTitular()),
                    value("email", conta.getEmail()),
                    value("birthDate", assinatura.getDataNascimentoTitular().format(DateTimeFormatter.ISO_DATE)),
                    value("taxDocument", taxDocument),
                    value("phone", phone),
                    value("shippingAddress", shippingAddress)
            );

            assinatura.setClientId((String) Moip.API.customers().create(customerRequestBody, setup).get("id"));

        } catch (Exception e) {
            if (e instanceof ValidationException)
                if (((ValidationException) e).getErrors().getErrors().stream().anyMatch(error -> error.getPath().equals("customer.ownId"))) {
                    ((ArrayList) Moip.API.customers().list(setup).get("customers")).forEach((o) -> {
                        if (((LinkedHashMap) o).get("ownId").equals(tenant)) {
                            assinatura.setClientId((String) ((LinkedHashMap) o).get("id"));
                        }
                    });
                }

            e.printStackTrace();
        }

        return assinatura;
    }

    /**
     * @return
     */
    public Map<String, Object> getNotificationPreferenceById(final String preferenceId) {
        return Moip.API.notificationPreferences().get(preferenceId, setup);
    }

    /**
     * @return
     */
    public List<Map<String, Object>> getNotificationPreferences() {
        return Moip.API.notificationPreferences().list(setup);
    }
}
