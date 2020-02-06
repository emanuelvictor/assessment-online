package online.meavalia.domain;

import lombok.RequiredArgsConstructor;
import online.meavalia.application.aspect.exceptions.AccessDeniedException;
import online.meavalia.application.tenant.TenantIdentifierResolver;
import online.meavalia.domain.entity.assinatura.fatura.Fatura;
import online.meavalia.domain.entity.avaliacao.Agrupador;
import online.meavalia.domain.entity.avaliacao.Avaliacao;
import online.meavalia.domain.entity.unidade.Dispositivo;
import online.meavalia.domain.entity.usuario.Conta;
import online.meavalia.domain.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AvaliacaoService {

    /**
     *
     */
    private final FaturaService faturaService;

    /**
     *
     */
    private final ContaRepository contaRepository;

    /**
     *
     */
    private final RecaptchaService recaptchaService;

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
    private final DispositivoRepository dispositivoRepository;

    /**
     *
     */
    private final TenantIdentifierResolver tenantIdentifierResolver;

    // todo REMOVER e DELETAR depois que aprender a fazer funcionar o cascade
    /**
     *
     */
    private final AvaliacaoAvaliavelRepository avaliacaoAvaliavelRepository;

    /**
     * @param agrupador
     * @return
     */
    private static Agrupador preSave(final Agrupador agrupador) {
        // Popula recursividade removida
        agrupador.getAvaliacoes().forEach(avaliacao -> {
                    avaliacao.setAgrupador(agrupador);
                    if (avaliacao.getAvaliacoesAvaliaveis() != null && !avaliacao.getAvaliacoesAvaliaveis().isEmpty())
                        avaliacao.getAvaliacoesAvaliaveis().forEach(avaliacaoAvaliavel -> avaliacaoAvaliavel.setAvaliacao(avaliacao));
                }
        );

        return agrupador;
    }

    /**
     * @param id
     * @return
     */
    public Optional<Avaliacao> findById(final long id) {
        return this.avaliacaoRepository.findById(id);
    }

    /**
     * @param agrupador
     * @return
     */
    public Mono<Agrupador> save(final Agrupador agrupador) {

        final Dispositivo dispositivo = this.dispositivoRepository.findById(agrupador.getAvaliacoes().get(0).getAvaliacoesAvaliaveis().get(0).getAvaliavel().getUnidadeTipoAvaliacaoDispositivo().getDispositivo().getId()).orElseThrow(() -> new RuntimeException("Dispositivo não  encontrado"));

        if (!dispositivo.isEnabled())
            throw new AccessDeniedException("Dispositivo desativado!");

        if (dispositivo.getNumeroSerie() == null)
            throw new AccessDeniedException("Este dispositivo está sem número de série vinculado no sistema WEB!");

        // Verifica se há faturas vencidas para o dispositivo
        final List<Fatura> faturas = this.faturaService.listByFilters(dispositivo.getTenant(), List.of(dispositivo.getId()), null).getContent();
        Assert.isTrue(faturas.stream().noneMatch(Fatura::isEmAtraso), "Faturas em atraso!");

        if (agrupador.getRecap() != null) {
            this.validateRecaptcha(agrupador);

            tenantIdentifierResolver.setSchema(dispositivo.getTenant());
            return Mono.just(saveInner(preSave(agrupador)));
        } else
            return ReactiveSecurityContextHolder.getContext()
                    .map(SecurityContext::getAuthentication)
                    .switchIfEmpty(Mono.empty())
                    .map(authentication -> saveInner(preSave(agrupador)));
    }

    /**
     * @param agrupador
     */
    private void validateRecaptcha(final Agrupador agrupador) {
        if (!recaptchaService.checkRecaptcha(agrupador.getRecap()))
            throw new RuntimeException("Você é um robô?");
    }

    /**
     * @param agrupador
     * @return
     */
    @Transactional
    Agrupador saveInner(final Agrupador agrupador) {
        this.agrupadorRepository.save(agrupador);

        agrupador.getAvaliacoes().forEach(avaliacao -> avaliacao.setAgrupador(agrupador));

        agrupador.getAvaliacoes().forEach(this.avaliacaoRepository::save);

        return agrupador;
    }

    /**
     * @param id
     * @param agrupador
     * @return
     */
    public Agrupador save(final long id, final Agrupador agrupador) {
        agrupador.setId(id);
        return this.agrupadorRepository.save(agrupador);
    }

    /**
     * @param id
     * @param avaliacao
     * @return
     */
    public Avaliacao save(final long id, final Avaliacao avaliacao) {
        Assert.isTrue(id > 0, "ID da avaliação incorreto");
        Assert.isTrue(avaliacao.getId().equals(id), "Você não tem acesso á essa avaliação");
        if (avaliacao.getAgrupador() == null)
            avaliacao.setAgrupador(new Agrupador());
        return this.avaliacaoRepository.save(avaliacao);
    }

    /**
     * @param id
     */
    public void delete(final long id) {
        this.avaliacaoRepository.deleteById(id);
    }

    /**
     * @param avaliacoes
     */
    @Transactional
    public void delete(final List<Avaliacao> avaliacoes) {
        this.avaliacaoRepository.deleteInBatch(avaliacoes);
    }

    /**
     * @param defaultFilter
     * @param unidadesFilter
     * @param dispositivosFilter
     * @param usuariosFilter
     * @param tiposAvaliacoesFilter
     * @param hasFeedback
     * @param dataInicioFilter
     * @param dataTerminoFilter
     * @param pageable
     * @return
     */
    @Transactional(readOnly = true)
    public Page<Avaliacao> listByFilters(final String defaultFilter,
                                         final List<Long> unidadesFilter,
                                         final List<Long> dispositivosFilter,
                                         final List<Long> usuariosFilter,
                                         final List<Long> tiposAvaliacoesFilter,
                                         final Boolean hasFeedback,
                                         final LocalDateTime dataInicioFilter,
                                         final LocalDateTime dataTerminoFilter,
                                         final Pageable pageable) {

        final Conta conta = contaRepository.findByEmailIgnoreCase(tenantIdentifierResolver.getUsername());

        final Long usuarioId = conta.isRoot() ? null : conta.getUsuario().getId();

        final Page<Avaliacao> avaliacoes = this.avaliacaoRepository.listByFilters(
                usuarioId,
                conta.getPerfil().name(),
                defaultFilter,
                unidadesFilter,
                dispositivosFilter,
                usuariosFilter,
                tiposAvaliacoesFilter,
                hasFeedback,
                dataInicioFilter,
                dataTerminoFilter,
                pageable
        );

        avaliacoes.getContent().forEach(avaliacao -> avaliacao.setAvaliacoesAvaliaveis(this.avaliacaoAvaliavelRepository.findAllByAvaliacaoId(avaliacao.getId())));

        return avaliacoes;

    }

}
