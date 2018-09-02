package br.com.assessment.domain.service;

import br.com.assessment.domain.entity.avaliacao.Avaliacao;
import br.com.assessment.domain.entity.colaborador.Colaborador;
import br.com.assessment.domain.repository.AvaliacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;

    public Optional<Avaliacao> findById(final long id) {
        return this.avaliacaoRepository.findById(id);
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

    public Page<Avaliacao> listByFilters(final String defaultFilter, final Pageable pageable) {
        throw new RuntimeException("Não implementado");
    }
    
}