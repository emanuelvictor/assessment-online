package br.com.ubest.domain.service;

import br.com.ubest.application.tenant.TenantIdentifierResolver;
import br.com.ubest.domain.entity.assinatura.Assinatura;
import br.com.ubest.domain.entity.assinatura.Fatura;
import br.com.ubest.domain.entity.assinatura.Item;
import br.com.ubest.domain.entity.unidade.Dispositivo;
import br.com.ubest.domain.repository.AvaliacaoRepository;
import br.com.ubest.domain.repository.FaturaRepository;
import br.com.ubest.infrastructure.payment.IPaymentGatewayRepository;
import br.com.ubest.infrastructure.tenant.TenantDetailsService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static br.com.ubest.Application.DEFAULT_TENANT_ID;

@Service
@RequiredArgsConstructor
public class FaturaService {

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
    private final DispositivoService dispositivoService;

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
    private final TenantIdentifierResolver tenantIdentifierResolver;

    /**
     *
     */
    private final IPaymentGatewayRepository paymentGatewayRepository;

    /**
     *
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(FaturaService.class);

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

            // Pego as últimas faturas em aberto
            final List<Fatura> ultimasFaturas = this.faturaRepository.findLastsFaturasByTenant(tenant);

            // Se tem faturas em aberto
            if (!ultimasFaturas.isEmpty())
                ultimasFaturas.forEach(ultimaFatura -> {

                    // Hoje é o dia 1 do mês seguinte ao da criação dela ou é depois?
                    if (LocalDate.now().isAfter(ultimaFatura.getDataAbertura().plusMonths(1).withDayOfMonth(1))) {

                        // A data de fechamento está nula? (Se estiver nula então ainda não foi fechada)
                        if (ultimaFatura.getDataFechamento() == null) {
                            this.fecharFatura(ultimaFatura);

                            if (assinatura.isAgruparFaturas())
                                this.inserirProximaFaturaAgrupada(new Fatura(tenant, assinatura));
                            else
                                this.inserirProximaFatura(ultimaFatura);

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
                if (this.assinaturaService.getAssinatura().isAgruparFaturas())
                    this.inserirPrimeiraFaturaAgrupada(new Fatura(tenant, assinatura));
                else {
                    dispositivoService.listByFilters(null, null).getContent().forEach(dispositivo -> {
                        final Fatura proximaFatura = new Fatura(tenant, assinatura);
                        proximaFatura.setItens(new HashSet<>());

                        if (dispositivo.isEnabled()) {
                            final Item item = new Item();
                            item.setDispositivo(dispositivo);
                            item.setFatura(proximaFatura);
                            item.setPreco(proximaFatura.getAssinatura().getPlano().getValorMensal());

                            proximaFatura.getItens().add(item);

                            this.inserirPrimeiraFatura(proximaFatura);
                        }
                    });
                }
            }
        });
    }


    /**
     * @param fatura
     * @return
     */
    @Transactional
    Fatura fecharFatura(final Fatura fatura) {

        LOGGER.info("Fechando fatura");

        fatura.setDataFechamento(fatura.getDataAbertura().plusMonths(1).withDayOfMonth(1));

        fatura.getItens().forEach(item -> {

            final int totalAvaliacoesDispositivo = this.avaliacaoRepository.countByDispositivoIdAndDates(item.getDispositivo().getId(), fatura.getDataFechamento().minusMonths(1).atStartOfDay(), fatura.getDataFechamento().atStartOfDay());

            BigDecimal preco = fatura.getAssinatura().getPlano().getValorMensal();
            if (totalAvaliacoesDispositivo > fatura.getAssinatura().getPlano().getQuantidadeAvaliacoes()) {
                final int valiacoesExcedentes = totalAvaliacoesDispositivo - fatura.getAssinatura().getPlano().getQuantidadeAvaliacoes();
                preco = preco.add(fatura.getAssinatura().getPlano().getValorAvaliacoesExcedentes().multiply(new BigDecimal(valiacoesExcedentes)));
            }

            item.setPreco(preco);

        });

        fatura.setOrderId(this.paymentGatewayRepository.fecharFatura(fatura).getOrderId());

        return this.faturaRepository.save(fatura);
    }

    /**
     * @param fatura
     * @return
     */
    @Transactional
    Fatura executarFatura(final Fatura fatura) {
        LOGGER.info("Executando fatura");

//        fatura.setPaymentId(this.paymentGatewayRepository.executarFatura(fatura).getPaymentId()); TODO concluir
//        fatura.setDataPagamento(LocalDate.now());

        fatura.setDataPagamento(fatura.getDataAbertura().plusMonths(1)); //TODO remover
        return this.faturaRepository.save(fatura);
    }

    /**
     * Insere uma fatura com base na última
     *
     * @param fatura
     * @return
     */
    @Transactional
    Fatura inserirProximaFatura(final Fatura fatura) {
        LOGGER.info("Inserindo próxima fatura com base na última");

        final Fatura proximaFatura = new Fatura(fatura.getTenant(), fatura.getAssinatura());
        proximaFatura.setItens(new HashSet<>());

        final List<Item> itensDaFatura = new ArrayList<>(fatura.getItens());

        for (Item value : itensDaFatura) {
            if (value.getDispositivo().isEnabled()) {
                final Item item = new Item();
                item.setDispositivo(value.getDispositivo());
                item.setFatura(proximaFatura);
                item.setPreco(proximaFatura.getAssinatura().getPlano().getValorMensal());

                proximaFatura.getItens().add(item);
            }
        }

        // Só insere se houver itens, e se a assinatura não estiver cancelada
        if (!proximaFatura.getItens().isEmpty() && !proximaFatura.getAssinatura().isCancelada())
            // Se eu tenho uma fatura posterior á anterior, então não insere.
            // Pois já foi inserida a próxima fatura agrupada
            return this.faturaRepository.save(proximaFatura);

        return null;
    }

    /**
     * Insere uma fatura que agrupa todas as licenças
     *
     * @param fatura
     * @return
     */
    @Transactional
    Fatura inserirProximaFaturaAgrupada(final Fatura fatura) {
        LOGGER.info("Inserindo próxima fatura agrupada");

        final Fatura proximaFatura = new Fatura(fatura.getTenant(), fatura.getAssinatura());
        proximaFatura.setItens(new HashSet<>());

        final List<Dispositivo> dispositivos = dispositivoService.listByFilters(null, null).getContent();
        dispositivos.forEach(dispositivo -> {
            if (dispositivo.isEnabled()) {
                final Item item = new Item();
                item.setDispositivo(dispositivo);
                item.setFatura(proximaFatura);
                item.setPreco(proximaFatura.getAssinatura().getPlano().getValorMensal());

                proximaFatura.getItens().add(item);
            }
        });

        // Só insere se houver itens, e se a assinatura não estiver cancelada
        if (!proximaFatura.getItens().isEmpty() && !proximaFatura.getAssinatura().isCancelada()) {
            // Se eu tenho uma fatura posterior á anterior, então não insere.
            // Pois já foi inserida a próxima fatura agrupada
            if (this.faturaRepository.next(proximaFatura.getTenant(), fatura.getDataAbertura()).isEmpty())
                return this.faturaRepository.save(proximaFatura);
        }

        return null;
    }

    /**
     * @param fatura
     * @return
     */
    @Transactional
    Fatura inserirPrimeiraFaturaAgrupada(final Fatura fatura) {
        LOGGER.info("Inserindo primeira fatura");
        return this.inserirProximaFaturaAgrupada(fatura);
    }

    /**
     * @param fatura
     * @return
     */
    @Transactional
    Fatura inserirPrimeiraFatura(final Fatura fatura) {
        LOGGER.info("Inserindo primeira fatura");
        return this.inserirProximaFatura(fatura);
    }

    /**
     * r
     *
     * @param defaultFilter
     * @param pageable
     * @return
     */
    @Transactional(readOnly = true)
    public Page<Fatura> listByFilters(final String defaultFilter, final Pageable pageable) {
        if (this.tenantIdentifierResolver.resolveCurrentTenantIdentifier().equals(DEFAULT_TENANT_ID))
            return this.faturaRepository.listByFilters(null, pageable);
        return this.faturaRepository.listByFilters(this.tenantIdentifierResolver.resolveCurrentTenantIdentifier(), pageable);
    }

    /**
     * @param id
     * @return
     */
    @Transactional(readOnly = true)
    public Optional<Fatura> findById(final long id) {
        return this.faturaRepository.findById(id);
    }
}
