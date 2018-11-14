package br.com.assessment.domain.service;

import br.com.assessment.domain.entity.avaliacao.Avaliacao;
import br.com.assessment.domain.entity.avaliacao.AvaliacaoColaborador;
import br.com.assessment.domain.repository.AvaliacaoColaboradorRepository;
import br.com.assessment.domain.repository.AvaliacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;

    // todo REMOVER e DELETAR depois que aprender a fazer funcionar o cascade
    private final AvaliacaoColaboradorRepository avaliacaoColaboradorRepository;

    public Optional<Avaliacao> findById(final long id) {
        return this.avaliacaoRepository.findById(id);
    }

    // todo REMOVER depois que aprender a fazer funcionar o cascade
    public AvaliacaoColaborador save(final AvaliacaoColaborador avaliacaoColaborador) {
        return this.avaliacaoColaboradorRepository.save(avaliacaoColaborador);
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

    public Page<Avaliacao> listByFilters(final List<Long> unidadesFilter,
                                         final List<Long> atendentesFilter,
                                         final LocalDateTime dataInicioFilter,
                                         final LocalDateTime dataTerminoFilter,
                                         final Pageable pageable) {

        final Page<Avaliacao> page = this.avaliacaoRepository.listByFilters(unidadesFilter, atendentesFilter, dataInicioFilter, dataTerminoFilter, pageable);

        // todo FALCATRUASSA
        page.getContent().forEach(avaliacao ->
                avaliacao.setAvaliacoesColaboradores(avaliacaoRepository.findAvaliacaoById(avaliacao.getId()).getAvaliacoesColaboradores())
        );

        return page;
    }

}