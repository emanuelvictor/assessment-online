package br.com.ubest.domain.service;

import br.com.ubest.application.tenant.TenantIdentifierResolver;
import br.com.ubest.domain.entity.assinatura.Assinatura;
import br.com.ubest.domain.entity.assinatura.Fatura;
import br.com.ubest.domain.entity.assinatura.Item;
import br.com.ubest.domain.repository.AssinaturaRepository;
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
import java.time.LocalDateTime;
import java.util.HashSet;
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
    private final DispositivoService dispositivoService;

    /**
     *
     */
    private final AvaliacaoRepository avaliacaoRepository;

    /**
     *
     */
    private final AssinaturaRepository assinaturaRepository;

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
            final Assinatura assinatura = assinaturaRepository.findAll().stream().findFirst().orElseThrow();

            // Pego a última fatura em aberto
            this.faturaRepository.findLastByTenant(tenant).stream().findFirst().ifPresentOrElse(ultimaFatura -> {

                        // Hoje é o dia 1 do mês seguinte ao da criação dela ou é depois?
                        if (LocalDate.now().isAfter(ultimaFatura.getDataAbertura().plusMonths(1).withDayOfMonth(1))) {

                            // A data de fechamento está nula? (Se estiver nula então ainda não foi fechada)
                            if (ultimaFatura.getDataFechamento() == null) {
                                this.fecharFatura(ultimaFatura);
                                this.inserirProximaFatura(new Fatura(tenant, assinatura));
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

                    },

                    // Se não há primeira fatura, insiro a primeira
                    () -> this.inserirPrimeiraFatura(new Fatura(tenant, assinatura))

            );
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

            final BigDecimal preco = fatura.getAssinatura().getPlano().getValorMensal();
            if (totalAvaliacoesDispositivo > fatura.getAssinatura().getPlano().getQuantidadeAvaliacoes()) {
                final int valiacoesExcedentes = totalAvaliacoesDispositivo - fatura.getAssinatura().getPlano().getQuantidadeAvaliacoes();
                preco.add(fatura.getAssinatura().getPlano().getValorAvaliacoesExcedentes().multiply(new BigDecimal(valiacoesExcedentes)));
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
     * @param fatura
     * @return
     */
    @Transactional
    Fatura inserirProximaFatura(final Fatura fatura) {
        LOGGER.info("Inserindo próxima fatura");

        dispositivoService.listByFilters(null, null).getContent().forEach(dispositivo -> { // TODO colocar datas

            final Item item = new Item();
            item.setDispositivo(dispositivo);
            item.setFatura(fatura);
            item.setPreco(fatura.getAssinatura().getPlano().getValorMensal());

            if (fatura.getItens() == null)
                fatura.setItens(new HashSet<>());

            fatura.getItens().add(item);

        });

        return this.faturaRepository.save(fatura);
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
