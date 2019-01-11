package br.com.assessment.domain.service;

import br.com.assessment.domain.entity.avaliacao.UnidadeTipoAvaliacao;
import br.com.assessment.domain.repository.UnidadeTipoAvaliacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UnidadeTipoAvaliacaoService {

    private final UnidadeTipoAvaliacaoRepository unidadeTipoAvaliacaoRepository;

    public Optional<UnidadeTipoAvaliacao> findById(final long id) {
        return this.unidadeTipoAvaliacaoRepository.findById(id);
    }

    public UnidadeTipoAvaliacao save(final UnidadeTipoAvaliacao tipoTipoAvaliacao) {
        return this.unidadeTipoAvaliacaoRepository.save(tipoTipoAvaliacao);
    }

    public UnidadeTipoAvaliacao save(final long id, final UnidadeTipoAvaliacao tipoTipoAvaliacao) {
        Assert.isTrue(id > 0, "ID da avaliação incorreto"); //TODO fazer o validador exclusivo
        return this.unidadeTipoAvaliacaoRepository.save(tipoTipoAvaliacao);
    }

    public void delete(final long id) {
        this.unidadeTipoAvaliacaoRepository.deleteById(id);
    }

    public Page<UnidadeTipoAvaliacao> listByFilters(final String defaultFilter, final Long tipoAvaliacaoId, final Long unidadeId, final Boolean ativo, final Pageable pageable) {
        return this.unidadeTipoAvaliacaoRepository.listByFilters(defaultFilter, tipoAvaliacaoId, unidadeId, ativo, pageable);
    }

}