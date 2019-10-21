package br.com.ubest.domain.service;

import br.com.ubest.application.tenant.TenantIdentifierResolver;
import br.com.ubest.domain.entity.assinatura.Assinatura;
import br.com.ubest.domain.entity.assinatura.Fatura;
import br.com.ubest.domain.repository.AssinaturaRepository;
import br.com.ubest.domain.repository.FaturaRepository;
import br.com.ubest.infrastructure.tenant.TenantDetailsService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

                        // Já tem uma fatura criada para 30 dias (ou u mês) do dia da assinatura? Se não, continua o fluxo de criação.
                        if (!ultimaFatura.getDataVencimento().isEqual(assinatura.getDataVencimentoProximaFatura())) {

                            // Então a última fatura, foi paga? Se sim, cria a próxima fatura
                            if (ultimaFatura.getDataPagamento() != null) {
                                this.inserirProximaFatura(new Fatura(tenant, assinatura));
                            }

                            // Se a fatura anterior não foi paga, então tenta executar a mesma.
                            else this.executarFatura(ultimaFatura);
                        }

//                        // Se a última fatura foi paga, então gera uma próxima fatura
//                        if (ultimaFatura.getDataPagamento() != null) {
//                            // A última fatura paga deve estar á 30 dias anteriores
//                            if ((LocalDate.now().isAfter(assinatura.getDataVencimentoProximaFatura().minusMonths(1))))
//                                this.inserirProximaFatura(new Fatura(tenant, assinatura));
//                        }
//                        // Se a última fatura não foi paga, então tenta executar
//                        else this.executarFatura(ultimaFatura);

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
    Fatura executarFatura(final Fatura fatura) {
        LOGGER.info("Executando fatura");
        fatura.setDataPagamento(fatura.getCreated().plusMonths(1).toLocalDate());
        return this.faturaRepository.save(fatura);
    }

    /**
     * @param fatura
     * @return
     */
    @Transactional
    Fatura inserirProximaFatura(final Fatura fatura) {
        LOGGER.info("Inserindo próxima fatura");
        return this.faturaRepository.save(fatura);
    }

    /**
     * @param fatura
     * @return
     */
    @Transactional
    Fatura inserirPrimeiraFatura(final Fatura fatura) {
        LOGGER.info("Inserindo primeira fatura");
        return this.faturaRepository.save(fatura);
    }
}
