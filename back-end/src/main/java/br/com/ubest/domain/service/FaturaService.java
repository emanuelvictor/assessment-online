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

import java.time.LocalDate;

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
    public void fecharFaturas() {
        LOGGER.info("Verificando faturas fechadas");
        tenantDetailsService.getAllTenants().forEach(tenant -> {
            tenantIdentifierResolver.setSchema(tenant);

            final Assinatura assinatura = assinaturaRepository.findAll().stream().findFirst().orElseThrow();
            if (LocalDate.now().isAfter(assinatura.getDataVencimentoFatura())) {

                final var ultimaFatura = this.faturaRepository.findLast();

                ultimaFatura.ifPresentOrElse(fatura -> {
                    if (fatura.getDataPagamento() != null) {
                        this.inserirFatura(new Fatura(tenant, assinatura));
                    }
                }, () -> {
                    this.inserirPrimeiraFatura(new Fatura(tenant, assinatura));
                });
            }

        });
//        LOGGER.info("Verificando fornecedores vencidos");
//        final List<Fornecedor> fornecedoresVencidos = this.fornecedorRepository.listFornecedoresAVencer(LocalDateTime.now().plusYears(-1), LocalDateTime.now().plusYears(-1).plusMonths(1));
//
//        if (!fornecedoresVencidos.isEmpty()) {
//
//            LOGGER.info(fornecedoresVencidos.size() + " fornecedores vencidos encontrados!");
//            LOGGER.info("Enviando e-mail para os seguintes fornecedores" + fornecedoresVencidos.stream().map(fornecedor -> fornecedor.getUsuario().getEmail()).collect(Collectors.joining(",")));
//
//            fornecedoresVencidos.forEach(fornecedor -> {
//
//                this.fornecedorMailRepository.sendMailToFornecedoresVencidos(fornecedor, this.url);
//
//                this.fornecedorRepository.updateSentEmailVencido(fornecedor.getId());
//            });
//        }
    }

    /**
     * @param fatura
     * @return
     */
    @Transactional
    Fatura inserirFatura(final Fatura fatura) {
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
