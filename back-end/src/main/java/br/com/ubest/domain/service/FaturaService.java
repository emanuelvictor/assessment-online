package br.com.ubest.domain.service;

import br.com.ubest.application.tenant.TenantIdentifierResolver;
import br.com.ubest.domain.entity.assinatura.Assinatura;
import br.com.ubest.domain.entity.assinatura.Cupom;
import br.com.ubest.domain.entity.assinatura.FormaPagamento;
import br.com.ubest.domain.entity.assinatura.fatura.Fatura;
import br.com.ubest.domain.entity.assinatura.fatura.Item;
import br.com.ubest.domain.entity.assinatura.fatura.Status;
import br.com.ubest.domain.entity.avaliacao.Agrupador;
import br.com.ubest.domain.entity.unidade.Dispositivo;
import br.com.ubest.domain.repository.*;
import br.com.ubest.infrastructure.payment.IPaymentGatewayRepository;
import br.com.ubest.infrastructure.tenant.TenantDetailsService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

import static br.com.ubest.Application.DEFAULT_TENANT_ID;

@Service
@RequiredArgsConstructor
public class FaturaService {

    /**
     *
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(FaturaService.class);
    /**
     *
     */
    private final CupomRepository cupomRepository;
    /**
     *
     */
    private final FaturaRepository faturaRepository;
    /**
     *
     */
    private final AssinaturaService assinaturaService;
    /**
     *
     */
    private final AgrupadorRepository agrupadorRepository;
    /**
     *
     */
    private final AvaliacaoRepository avaliacaoRepository;
    /**
     *
     */
    private final TenantDetailsService tenantDetailsService;
    /**
     *
     */
    private final DispositivoRepository dispositivoRepository;
    /**
     *
     */
    private final TenantIdentifierResolver tenantIdentifierResolver;
    /**
     *
     */
    private final IPaymentGatewayRepository paymentGatewayRepository;

    /**
     *
     */
    public void verificarFaturas() {
        // Percorre todos os tenant's
        tenantDetailsService.getAllTenants().forEach(tenant -> {

            LOGGER.info("Verificando faturas fechadas do cliente: " + tenant);

            // Seta o tennnt
            tenantIdentifierResolver.setSchema(tenant);

            // Pega a assinatura
            final Assinatura assinatura = assinaturaService.getAssinatura();

            if (!assinatura.isCompleted())
                return;

            final Cupom cupom = this.cupomRepository.findByTenant(tenant);

            // Pego as últimas faturas em aberto
            final List<Fatura> ultimasFaturas = this.faturaRepository.findLastsFaturasByTenant(tenant);

            // Pego os dispositivos
            final Set<Dispositivo> dispositivos = new HashSet<>(this.dispositivoRepository.listByFilters(null, tenant, null).getContent());

            // Se tem faturas em aberto
            if (!ultimasFaturas.isEmpty())
                ultimasFaturas.forEach(ultimaFatura -> {

                    // Hoje é o dia 1 do mês seguinte ao da criação dela ou é depois?
                    if (LocalDate.now().isAfter(ultimaFatura.getDataAbertura().plusMonths(1).withDayOfMonth(1))) {

                        // A data de fechamento está nula? (Se estiver nula então ainda não foi fechada)
                        if (ultimaFatura.getDataFechamento() == null) {
                            this.fecharFatura(ultimaFatura);

                            if (assinatura.isAgruparFaturas())
                                this.inserirProximaFaturaAgrupada(tenant, assinatura, cupom, dispositivos);
                            else
                                this.inserirProximaFaturaNaoAgrupada(tenant, assinatura, cupom, dispositivos);

                        } else {
                            // É dia (ou depois) do vencimento da fatura
                            if (LocalDate.now().isEqual(ultimaFatura.getDataVencimento()) || LocalDate.now().isAfter(ultimaFatura.getDataVencimento())) {
                                // A data de pagamento está nula?
                                if (ultimaFatura.getDataPagamento() == null) {
                                    this.executarFatura(ultimaFatura);
                                }
                            }
                        }
                    }

                });

                // Se não há primeira fatura, insiro a primeira
            else {
                if (assinatura.isAgruparFaturas())
                    this.inserirProximaFaturaAgrupada(tenant, assinatura, cupom, dispositivos);
                else {
                    dispositivos.forEach(dispositivo -> {
                        final Fatura proximaFatura = new Fatura(tenant, assinatura, cupom, new HashSet<>());

                        if (dispositivo.isEnabled()) {
                            final Item item = new Item();
                            item.setDispositivo(dispositivo);
                            item.setFatura(proximaFatura);

                            proximaFatura.getItens().add(item);

                            this.faturaRepository.save(proximaFatura);
                        }
                    });
                }
            }
        });
    }


    /**
     * @param fatura
     */
    @Transactional
    void fecharFatura(final Fatura fatura) {
        LOGGER.info("Fechando fatura");

        fatura.setDataFechamento(fatura.getDataAbertura().plusMonths(1).withDayOfMonth(1));

        fatura.getItens().forEach(item ->

                item.setTotalAvaliacoes(this.avaliacaoRepository.countByDispositivoIdAndDates(item.getDispositivo().getId(), fatura.getDataFechamento().minusMonths(1).atStartOfDay(), fatura.getDataFechamento().atStartOfDay()))

        );

        fatura.setOrderId(this.paymentGatewayRepository.fecharFatura(fatura).getOrderId());

        if (fatura.getAssinatura().getFormaPagamento().equals(FormaPagamento.BOLETO)) {
            final Fatura faturaComBoleto = this.paymentGatewayRepository.executarFatura(fatura);
            fatura.setPaymentId(faturaComBoleto.getPaymentId());
            fatura.setLinkBoleto(faturaComBoleto.getLinkBoleto());
        }

        this.faturaRepository.save(fatura);
    }

    /**
     * @param fatura
     */
    @Transactional
    void executarFatura(final Fatura fatura) {
        LOGGER.info("Executando fatura");

        if (fatura.getAssinatura().getFormaPagamento().equals(FormaPagamento.BOLETO)) {
            if (!fatura.getStatus().equals(Status.AUTHORIZED) && !fatura.getStatus().equals(Status.PAID)) {
                fatura.setStatus(Status.OVERDUE);
                this.faturaRepository.save(fatura);
            }
        } else {
            final Fatura faturaComPaymentId = this.paymentGatewayRepository.executarFatura(fatura);
            fatura.setPaymentId(faturaComPaymentId.getPaymentId());
            this.faturaRepository.save(fatura);
        }
    }

    /**
     * @param tenant
     * @param assinatura
     * @param dispositivos
     */
    @Transactional
    void inserirProximaFaturaNaoAgrupada(final String tenant, final Assinatura assinatura, final Cupom cupom, final Set<Dispositivo> dispositivos) {
        LOGGER.info("Inserindo próxima fatura com base na última");

        for (final Dispositivo dispositivo : dispositivos) {
            if (dispositivo.isEnabled()) {

                final Fatura proximaFatura = new Fatura(tenant, assinatura, cupom, new HashSet<>());

                final Item item = new Item();
                item.setDispositivo(dispositivo);
                item.setFatura(proximaFatura);

                proximaFatura.getItens().add(item);

                // Só insere se houver itens, e se a assinatura não estiver cancelada
                if (!proximaFatura.getItens().isEmpty() && !proximaFatura.getAssinatura().isCancelada())
                    if (this.faturaRepository.next(proximaFatura.getTenant(), proximaFatura.getDataAbertura()).size() != dispositivos.size())
                        this.faturaRepository.save(proximaFatura);
            }
        }

    }

    /**
     * @param tenant
     * @param assinatura
     * @param dispositivos
     */
    @Transactional
    void inserirProximaFaturaAgrupada(final String tenant, final Assinatura assinatura, final Cupom cupom, final Set<Dispositivo> dispositivos) {
        LOGGER.info("Inserindo próxima fatura agrupada");

        final Fatura proximaFatura = new Fatura(tenant, assinatura, cupom, new HashSet<>());

        dispositivos.forEach(dispositivo -> {
            if (dispositivo.isEnabled()) {
                final Item item = new Item();
                item.setDispositivo(dispositivo);
                item.setFatura(proximaFatura);

                proximaFatura.getItens().add(item);
            }
        });

        // Só insere se houver itens, e se a assinatura não estiver cancelada
        if (!proximaFatura.getItens().isEmpty() && !proximaFatura.getAssinatura().isCancelada()) {
            // Se eu tenho uma fatura posterior á anterior, então não insere.
            // Pois já foi inserida a próxima fatura agrupada
            if (this.faturaRepository.next(proximaFatura.getTenant(), proximaFatura.getDataAbertura()).isEmpty()) {
                this.faturaRepository.save(proximaFatura);
            }
        }

    }

    /**
     * @param defaultFilter
     * @param pageable
     * @return
     */
    @Transactional(readOnly = true)
    public Page<Fatura> listByFilters(final String defaultFilter, final List<Long> dispositivosId, final Pageable pageable) {
        if (this.tenantIdentifierResolver.resolveCurrentTenantIdentifier().equals(DEFAULT_TENANT_ID))
            return this.faturaRepository.listByFilters(null, dispositivosId, pageable);
        return this.faturaRepository.listByFilters(this.tenantIdentifierResolver.resolveCurrentTenantIdentifier(), dispositivosId, pageable);
    }

    /**
     * @param id
     * @return
     */
    @Transactional(readOnly = true)
    public Optional<Fatura> findById(final long id) {
        return this.faturaRepository.findById(id);
    }

    /**
     * @return
     */
    private void authenticateTokenOfNotification(final String authentication) {
        if (this.paymentGatewayRepository.getNotificationPreferences().stream().noneMatch(stringObjectMap -> stringObjectMap.get("token").equals(authentication)))
            throw new RuntimeException("Token para autenticacao inválido");
    }

    /**
     * @param authentication
     * @param paymentNotification
     * @return
     */
    @Transactional
    public Fatura updatePaymentByNotification(final String authentication, final Object paymentNotification) {

        this.authenticateTokenOfNotification(authentication);

        return this.updatePaymentByNotification(paymentNotification);
    }

    /**
     * @param paymentNotification
     * @return
     */
    public Fatura updatePaymentByNotification(final Object paymentNotification) {

        final Fatura fatura = this.updatePaymentByNotificationTransaction(paymentNotification);

        return fatura;
    }

    /**
     * @param paymentNotification
     * @return
     */
    @Transactional
    public Fatura updatePaymentByNotificationTransaction(final Object paymentNotification) {
        final Fatura fatura;

        if (((LinkedHashMap) ((LinkedHashMap) paymentNotification).get("resource")).get("payment") != null) {
            fatura = this.faturaRepository.findByPaymentId((String) (((LinkedHashMap) ((LinkedHashMap) ((LinkedHashMap) paymentNotification).get("resource")).get("payment")).get("id"))).orElseThrow();
            fatura.setStatus((String) (((LinkedHashMap) ((LinkedHashMap) ((LinkedHashMap) paymentNotification).get("resource")).get("payment")).get("status")));
        } else if (((LinkedHashMap) ((LinkedHashMap) paymentNotification).get("resource")).get("order") != null) {
            fatura = this.faturaRepository.findById(Long.valueOf((String) (((LinkedHashMap) ((LinkedHashMap) ((LinkedHashMap) paymentNotification).get("resource")).get("order")).get("ownId")))).orElseThrow();
            fatura.setStatus((String) (((LinkedHashMap) ((LinkedHashMap) ((LinkedHashMap) paymentNotification).get("resource")).get("order")).get("status")));
        } else {
            System.out.println(" ------------ XABÚ ------------------");
            return null;
        }

        if (fatura.getStatus().equals(Status.PAID) || fatura.getStatus().equals(Status.AUTHORIZED)) {
            fatura.setDataPagamento(LocalDate.now());
            fatura.setStatus(Status.OVERDUE);
        }

        return this.faturaRepository.save(fatura);
    }

    /**
     * @param authentication
     * @param orderNotification
     * @return
     */
    @Transactional
    public Fatura updateOrderByNotification(final String authentication, final Object orderNotification) {

        this.authenticateTokenOfNotification(authentication);

        return this.updateOrderByNotification(orderNotification);
    }

    /**
     * @param orderNotification
     * @return
     */
    public Fatura updateOrderByNotification(final Object orderNotification) {

        final Fatura fatura = this.updateOrderByNotificationTransaction(orderNotification);

        return fatura;
    }

    /**
     * @param orderNotification
     * @return
     */
    @Transactional
    public Fatura updateOrderByNotificationTransaction(final Object orderNotification) {
        final Fatura fatura = this.faturaRepository.findById(Long.valueOf((String) (((LinkedHashMap) ((LinkedHashMap) ((LinkedHashMap) orderNotification).get("resource")).get("order")).get("ownId")))).orElseThrow();

        fatura.setStatus((String) (((LinkedHashMap) ((LinkedHashMap) ((LinkedHashMap) orderNotification).get("resource")).get("order")).get("status")));

        if (fatura.getStatus().equals(Status.PAID) || fatura.getStatus().equals(Status.AUTHORIZED)) {
            fatura.setDataPagamento(LocalDate.now());
            fatura.setStatus(Status.OVERDUE);
        }

        return this.faturaRepository.save(fatura);
    }

    /**
     * @param fatura
     */
    public Fatura verifyInativos(final Fatura fatura) {
        // Verifica se há faturas vencidas para o dispositivo
        final List<Fatura> faturas = this.faturaRepository.listByFilters(fatura.getTenant(), null, null).getContent();
        if (faturas.stream().noneMatch(Fatura::isEmAtraso)) {
            this.asdfa();
        }

        return fatura;
    }

    /**
     *
     */
    @Transactional
    public void asdfa() {
        final List<Agrupador> agrupadores = agrupadorRepository.listAllInativos();
        agrupadores.forEach(agrupador -> agrupador.setAtivo(true));
        agrupadorRepository.saveAll(agrupadores);
    }
}
