package br.com.ubest.domain.service;

import br.com.ubest.application.multitenancy.TenantIdentifierResolver;
import br.com.ubest.domain.entity.avaliacao.Agrupador;
import br.com.ubest.domain.entity.avaliacao.Avaliacao;
import br.com.ubest.domain.entity.avaliacao.AvaliacaoAvaliavel;
import br.com.ubest.domain.entity.usuario.Conta;
import br.com.ubest.domain.repository.AgrupadorRepository;
import br.com.ubest.domain.repository.AvaliacaoAvaliavelRepository;
import br.com.ubest.domain.repository.AvaliacaoRepository;
import br.com.ubest.domain.repository.ContaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AvaliacaoService {

    private final ContaRepository contaRepository;

    private final AgrupadorRepository agrupadorRepository;

    private final AvaliacaoRepository avaliacaoRepository;

    private final TenantIdentifierResolver tenantIdentifierResolver;

    // todo REMOVER e DELETAR depois que aprender a fazer funcionar o cascade
    private final AvaliacaoAvaliavelRepository avaliacaoAvaliavelRepository;

    // todo REMOVER depois que aprender a fazer funcionar o cascade
    public AvaliacaoAvaliavel save(final AvaliacaoAvaliavel avaliacaoAvaliavel) {
        return this.avaliacaoAvaliavelRepository.save(avaliacaoAvaliavel);
    }

    public Optional<Avaliacao> findById(final long id) {
        return this.avaliacaoRepository.findById(id);
    }

    public Agrupador save(final long id, final Agrupador agrupador) {
        agrupador.setId(id);
        return this.agrupadorRepository.save(agrupador);
    }

    @Transactional
    public Avaliacao save(final Avaliacao avaliacao) {

        if (avaliacao.getAvaliacoesAvaliaveis() != null)
            avaliacao.getAvaliacoesAvaliaveis().forEach(avaliacaoAvaliavel ->
                    avaliacaoAvaliavel.setAvaliacao(avaliacao)
            );

        if (avaliacao.getAgrupador().getId() != null)
            avaliacao.setAgrupador(this.agrupadorRepository.findById(avaliacao.getAgrupador().getId()).orElse(null));

        return this.avaliacaoRepository.save(avaliacao);
    }

    public Avaliacao save(final long id, final Avaliacao avaliacao) {
        Assert.isTrue(id > 0, "ID da avaliação incorreto");
        Assert.isTrue(avaliacao.getId().equals(id), "Você não tem acesso á essa avaliação");
        return this.avaliacaoRepository.save(avaliacao);
    }

    public void delete(final long id) {
        this.avaliacaoRepository.deleteById(id);
    }

    @Transactional
    public void delete(final List<Avaliacao> avaliacoes) {
        this.avaliacaoRepository.deleteInBatch(avaliacoes);
    }

    @Transactional
    public Page<Avaliacao> listByFilters(final List<Long> unidadesFilter,
                                         final List<Long> usuariosFilter,
                                         final LocalDateTime dataInicioFilter,
                                         final LocalDateTime dataTerminoFilter,
                                         final Pageable pageable) {

        final Conta conta = contaRepository.findByEmailIgnoreCase(tenantIdentifierResolver.getUsername());

        final Long usuarioId = conta.isRoot() ? null : conta.getUsuario().getId();

        return this.avaliacaoRepository.listByFilters(
                usuarioId,
                conta.getPerfil().name(),
                unidadesFilter,
                usuariosFilter,
                dataInicioFilter,
                dataTerminoFilter,
                pageable
        );

    }

}
