package br.com.assessment.domain.service;

import br.com.assessment.domain.entity.avaliacao.Avaliacao;
import br.com.assessment.domain.entity.avaliacao.AvaliacaoAvaliavel;
import br.com.assessment.domain.repository.AvaliacaoAvaliavelRepository;
import br.com.assessment.domain.repository.AvaliacaoRepository;
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

    private final AvaliacaoRepository avaliacaoRepository;

    // todo REMOVER e DELETAR depois que aprender a fazer funcionar o cascade
    private final AvaliacaoAvaliavelRepository avaliacaoAvaliavelRepository;

    public Optional<Avaliacao> findById(final long id) {
        return this.avaliacaoRepository.findById(id);
    }

    // todo REMOVER depois que aprender a fazer funcionar o cascade
    public AvaliacaoAvaliavel save(final AvaliacaoAvaliavel avaliacaoAvaliavel) {
        return this.avaliacaoAvaliavelRepository.save(avaliacaoAvaliavel);
    }

    public Avaliacao save(final Avaliacao avaliacao) {
        return this.avaliacaoRepository.save(avaliacao);
    }

    public Avaliacao save(final long id, final Avaliacao avaliacao) {
        Assert.isTrue(id > 0, "ID da avaliação incorreto"); //TODO fazer o validador exclusivo
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

        final Page<Avaliacao> page = this.avaliacaoRepository.listByFilters(unidadesFilter, usuariosFilter, dataInicioFilter, dataTerminoFilter, pageable);

        // todo FALCATRUASSA
        page.getContent().forEach(avaliacao ->
                avaliacao.setAvaliacoesAvaliaveis(avaliacaoAvaliavelRepository.listAvaliacaoAvaliavelByAvaliacaoId(avaliacao.getId()))
        );

        return page;
    }

}