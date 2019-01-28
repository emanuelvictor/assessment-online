package br.com.assessment.domain.service;

import br.com.assessment.domain.entity.avaliacao.TipoAvaliacao;
import br.com.assessment.domain.repository.TipoAvaliacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TipoAvaliacaoService {

    private final UnidadeTipoAvaliacaoService unidadeTipoAvaliacaoService;

    private final TipoAvaliacaoRepository tipoAvaliacaoRepository;

    public Optional<TipoAvaliacao> findById(final long id) {
        return this.tipoAvaliacaoRepository.findById(id);
    }

    public TipoAvaliacao save(final TipoAvaliacao tipoTipoAvaliacao) {
        return this.tipoAvaliacaoRepository.save(tipoTipoAvaliacao);
    }

    public TipoAvaliacao save(final long id, final TipoAvaliacao tipoTipoAvaliacao) {
        Assert.isTrue(id > 0, "ID da avaliação incorreto"); //TODO fazer o validador exclusivo
        return this.tipoAvaliacaoRepository.save(tipoTipoAvaliacao);
    }

    @Transactional
    public void delete(final long id) {

        this.unidadeTipoAvaliacaoService.delete(this.unidadeTipoAvaliacaoService.findAllByTipoAvaliacaoId(id));

        this.tipoAvaliacaoRepository.deleteById(id);
    }

    public Page<TipoAvaliacao> listByFilters(final String defaultFilter, final List<Long> unidadesFilter, final Pageable pageable) {
        return this.tipoAvaliacaoRepository.listByFilters(defaultFilter, unidadesFilter, pageable);
    }

}