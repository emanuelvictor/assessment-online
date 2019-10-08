package br.com.ubest.domain.service;

import br.com.ubest.application.hibernate.multitenancy.TenantIdentifierResolver;
import br.com.ubest.domain.entity.avaliacao.Agrupador;
import br.com.ubest.domain.entity.avaliacao.Avaliacao;
import br.com.ubest.domain.entity.usuario.Conta;
import br.com.ubest.domain.repository.*;
import lombok.RequiredArgsConstructor;
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

        if (agrupador.getRecap() != null) {
            this.validateRecaptcha(agrupador);

            tenantIdentifierResolver.setSchema(agrupador.avaliacoes.get(0).avaliacoesAvaliaveis.get(0).getAvaliavel().getUnidadeTipoAvaliacaoDispositivo().getDispositivo().getTenant());
            return Mono.just(saveInner(preSave(agrupador)));
        } else {
            return ReactiveSecurityContextHolder.getContext()
                    .map(SecurityContext::getAuthentication)
                    .switchIfEmpty(Mono.empty())
                    .map(authentication -> saveInner(preSave(agrupador)));
        }
    }

    /**
     *
     * @param agrupador
     */
    @Transactional(readOnly = true)
    void validateRecaptcha(final Agrupador agrupador) {
        if (this.dispositivoRepository.findById(agrupador.avaliacoes.get(0).avaliacoesAvaliaveis.get(0).getAvaliavel().getUnidadeTipoAvaliacaoDispositivo().getDispositivo().getId()).orElseThrow().isInterna())
            throw new RuntimeException("Licença interna");
        if (!recaptchaService.checkRecaptcha(agrupador.getRecap()))
            throw new RuntimeException("Você é um robô?");
    }

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

//    /**
//     * @param avaliacao
//     * @return
//     */
//    @Transactional
//    public Avaliacao save(final Avaliacao avaliacao) {
//
//        if (avaliacao.getAvaliacoesAvaliaveis() != null)
//            avaliacao.getAvaliacoesAvaliaveis().forEach(avaliacaoAvaliavel ->
//                    avaliacaoAvaliavel.setAvaliacao(avaliacao)
//            );
//
//        if (avaliacao.getAgrupador() != null && avaliacao.getAgrupador().getId() != null)
//            avaliacao.setAgrupador(this.agrupadorRepository.findById(avaliacao.getAgrupador().getId()).orElse(null));
//
//        if (avaliacao.getAgrupador() == null) {
//            var agrupador = new Agrupador();
//            agrupador.setAvaliacoes(List.of(avaliacao));
//            avaliacao.setAgrupador(agrupador);
//        }
//
//        return this.save(avaliacao.getAgrupador()).getAvaliacoes().get(0);
//    }

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
