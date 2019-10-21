package br.com.ubest.domain.repository.impl;

import br.com.moip.Moip;
import br.com.moip.models.NotificationPreferences;
import br.com.moip.models.Setup;
import br.com.ubest.application.tenant.TenantIdentifierResolver;
import br.com.ubest.domain.entity.assinatura.Assinatura;
import br.com.ubest.domain.entity.assinatura.Fatura;
import br.com.ubest.infrastructure.payment.IPaymentGatewayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
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
//	/**
//	 *
//	 */
//	@Value("${gateway-payment.key}")
//	private String key;
//
//	/**
//	 *
//	 */
//	@Value("${gateway-payment.token}")
//	private String token;
//
//	/**
//	 *
//	 */
//	@Value("${gateway-payment.logo-uri}")
//	private String logoUri;
//
//	/**
//	 *
//	 */
//	@Value("${gateway-payment.gateway-uri}")
//	private String gatewayUri;
//
//	/**
//	 *
//	 */
//	@Value("${gateway-payment.expiration-days}")
//	private Integer expirationDays;
//
//	/**
//	 *
//	 */
//	@Value("${gateway-payment.checkout-boleto-uri}")
//	private String checkoutBoletoUri;

    /**
     *
     */
    @Override
    public Fatura execute(final Fatura fatura) {
//        final Turma turma = compra.getMatriculas().get(0).getLote().getTurma();
//
//        final Curso curso = turma.getCurso();
//
//        final Usuario responsavel = compra.getResponsavel();
//
//        final Pagamento pagamento = compra.getPagamento();
//
//        final Endereco endereco = pagamento.getEndereco();
//
//        final OrderRequest orderRequest = new OrderRequest().ownId(compra.getId().toString());
//
//        final int taxaMatricula = new Double(0).intValue();
//
//        // Pagamento do receber (instrutor/organizador)
//        final AmountRequest secondaryAmountRequest = new AmountRequest();
//        // 90% vai para o recebedor secundário (organizador)
//        secondaryAmountRequest.percentual(100 - taxaMatricula);
//        final ReceiverRequest secondaryReceiverRequest = new ReceiverRequest();
//        secondaryReceiverRequest.secondary(curso.getOrganizador().getAccountId(), secondaryAmountRequest);
//        orderRequest.addReceiver(secondaryReceiverRequest);
//
//        for (final Matricula matricula : compra.getMatriculas()) {
//            if ((matricula.getLote().getPreco().intValue() * 100) > 0) {
//                orderRequest.addItem(curso.getNome(), 1, "Lote: " + matricula.getLote().getNome(), matricula.getLote().getPreco().intValue() * 100);
//            }
//        }
//
//        final CustomerRequest customerRequest = new CustomerRequest().ownId(UUID.randomUUID().toString()).fullname(responsavel.getNome()).email(responsavel.getEmail());
//
//        if (responsavel.getIsEmpresa()) {
//            customerRequest.taxDocument(TaxDocumentRequest.cnpj(responsavel.getDocumento()));
//        } else {
//            customerRequest.taxDocument(TaxDocumentRequest.cpf(responsavel.getDocumento()));
//        }
//
//        customerRequest
//                .phone(new PhoneRequest() //
//                        .setAreaCode(Short.toString(pagamento.getCodigoArea()))//
//                        .setNumber(Long.toString(pagamento.getTelefone())))//
//                .shippingAddressRequest(new ShippingAddressRequest()//
//                        .street(endereco.getLogradouro())//
//                        .streetNumber(endereco.getNumero())//
//                        .complement(endereco.getComplemento())//
//                        .city(endereco.getCidade().getNome())//
//                        .state(endereco.getCidade().getEstado().getUf())//
//                        .district(endereco.getBairro())//
//                        .country("BRA")//
//                        .zipCode(endereco.getCep())//
//                );
//
//        final Order createdOrder = this.api.order().create(orderRequest.customer(customerRequest));
//
//        final Payment payment;
//
//        final EscrowRequest escrowRequest = new EscrowRequest();
//        escrowRequest.setDescription("A execução do curso deve ser comprovada para liberação do pagamento");
//
//        if (pagamento.getFormaPagamento() == FormaPagamento.BOLETO) {
//            final Date today = new Date();
//            final Calendar tomorrow = Calendar.getInstance();
//            tomorrow.setTime(today);
//            tomorrow.add(Calendar.DATE, expirationDays);
//
//            payment = this.api.payment().create( //
//                    new PaymentRequest()//
//                            .escrow(escrowRequest).orderId(createdOrder.getId())//
//                            .installmentCount(1)//
//                            .fundingInstrument(new FundingInstrumentRequest().boleto(new BoletoRequest()//
//                                    .expirationDate(new ApiDateRequest().date(tomorrow.getTime()))//
//                                    .logoUri(logoUri)//
//                                    .instructionLines(new InstructionLinesRequest()
//                                            .first(responsavel.getIsEmpresa() ? "CNPJ do pagador: " + new CNPJFormatter().format(responsavel.getDocumento()) : "CPF do pagador: " + new CPFFormatter().format(responsavel.getDocumento())))//
//                            )));
//
//            compra.getPagamento().setLinkPagamento(checkoutBoletoUri + payment.getId() + "/print");
//
//        } else {
//            final PhoneRequest phoneRequest = new PhoneRequest().countryCode("55");
//            phoneRequest.setAreaCode(Byte.toString(pagamento.getCodigoArea()));
//            phoneRequest.setNumber(Long.toString(pagamento.getTelefone()));
//
//            final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE;
//
//            payment = this.api.payment().create( //
//                    new PaymentRequest()//
//                            .escrow(escrowRequest).orderId(createdOrder.getId())//
//                            .installmentCount(1)//
//                            .fundingInstrument(new FundingInstrumentRequest().creditCard(new CreditCardRequest().holder(new HolderRequest().taxDocument(pagamento.getIsEmpresa() ? TaxDocumentRequest.cnpj(pagamento.getDocumentoTitularCartao()) : TaxDocumentRequest.cpf(pagamento.getDocumentoTitularCartao())).fullname(pagamento.getNomeTitularCartao()).birthdate(pagamento.getDataNascimentoTitularCartao().format(formatter)).phone(phoneRequest)).hash(pagamento.getHash()))));
//
//        }
//
//        pagamento.setStatusPagamento(payment.getStatus());
//
//        pagamento.setPaymentId(payment.getId());
//
//        compra.setPagamento(pagamento);
//
//        return compra;
        return null;
    }

    /**
     *
     */
    @Override
    public Assinatura createAccount(final Assinatura assinatura) {

        try {

            final String tenant = tenantIdentifierResolver.resolveCurrentTenantIdentifier();

            final Map<String, Object> taxDocument = payloadFactory(
                    value("type", assinatura.getSouEmpresa() != null && assinatura.getSouEmpresa() ? "CNPJ" : "CPF"),
                    value("number", assinatura.getDocumentoTitularCartao())
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
                    value("ownId", tenant),
                    value("fullname", assinatura.getNomeTitularCartao()),
                    value("email", tenant),
                    value("birthDate", assinatura.getDataNascimentoTitularCartao().format(DateTimeFormatter.ISO_DATE)),
                    value("taxDocument", taxDocument),
                    value("phone", phone),
                    value("shippingAddress", shippingAddress)
            );

            assinatura.setPaymentGatewayId((String) Moip.API.customers().create(customerRequestBody, setup).get("id"));

        } catch (Exception e) {
            throw new RuntimeException("Ops! Existe alguma incompatibilidade entre seus dados e nosso provedor de pagamento. Por favor, verifique e tente novamente.");
        }

        return assinatura;
    }

    /**
     *
     */
    public Assinatura createBankAccount(final Assinatura assinatura) {
//        try {
//            final Client client = new Client(this.gatewayUri, new OAuth(curso.getOrganizador().getAccessToken()));
//
//            final BankAccountsAPI bankAccountsAPI = new BankAccountsAPI(client);
//
//            final BankAccount createdBankAccount = bankAccountsAPI.create(curso.getOrganizador().getAccountId(), new BankAccountRequest().bankNumber(curso.getDadosDeposito().getBanco().getCodigo()).agencyNumber(curso.getDadosDeposito().getNumeroAgencia()).agencyCheckNumber(curso.getDadosDeposito().getDigitoAgencia()).accountNumber(curso.getDadosDeposito().getNumeroConta()).accountCheckNumber(curso.getDadosDeposito().getDigitoConta()).checking()
//                    .holder(new HolderRequest().fullname(curso.getDadosDeposito().getNomeTitular()).taxDocument(curso.getDadosDeposito().getDadosDepositoIsEmpresa() ? TaxDocumentRequest.cnpj(curso.getDadosDeposito().getDocumento()) : TaxDocumentRequest.cpf(curso.getDadosDeposito().getDocumento()))));
//
//            curso.getDadosDeposito().setBankAccountId(createdBankAccount.getId());
//
//            return curso;
//        } catch (Exception e) {
//            throw new RuntimeException("Ops! Existe alguma incompatibilidade entre seus dados e nosso provedor de pagamento. Por favor, verifique e tente novamente.");
//        }
        return null;
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
