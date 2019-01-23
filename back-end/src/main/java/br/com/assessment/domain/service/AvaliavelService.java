package br.com.assessment.domain.service;

import br.com.assessment.domain.entity.usuario.vinculo.Avaliavel;
import br.com.assessment.domain.repository.AvaliavelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AvaliavelService {

    private final AvaliavelRepository avaliavelRepository;

    private final AvaliacaoAvaliavelService avaliacaoAvaliavelService;

    public Optional<Avaliavel> findById(final long id) {
        return this.avaliavelRepository.findById(id);
    }

    public Avaliavel save(final Avaliavel avaliavel) {
        return this.avaliavelRepository.save(avaliavel);
    }

    public Avaliavel save(final long id, final Avaliavel avaliavel) {
        Assert.isTrue(id > 0, "ID do avaliavel incorreto"); //TODO fazer o validador exclusivo
        return this.avaliavelRepository.save(avaliavel);
    }

    public void delete(final long id) {
        this.avaliavelRepository.deleteById(id);
    }

    public Page<Avaliavel> listByFilters(final String defaultFilter, final Long usuarioId, final Long unidadeId, final Long unidadeTipoAvaliacaoId, final Pageable pageable) {
        return this.avaliavelRepository.listByFilters(defaultFilter, usuarioId, unidadeId, unidadeTipoAvaliacaoId, pageable);
    }

}