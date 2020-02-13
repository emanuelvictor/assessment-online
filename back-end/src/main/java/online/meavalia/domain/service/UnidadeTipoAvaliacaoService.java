package online.meavalia.domain.service;

import lombok.RequiredArgsConstructor;
import online.meavalia.domain.entity.avaliacao.UnidadeTipoAvaliacao;
import online.meavalia.domain.repository.UnidadeTipoAvaliacaoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UnidadeTipoAvaliacaoService {

    private final UnidadeTipoAvaliacaoRepository unidadeTipoAvaliacaoRepository;

    private final AvaliavelService avaliavelService;

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

    @Transactional
    public void delete(final List<UnidadeTipoAvaliacao> unidadesTiposAvaliacoes) {

        // Deleta Avaliaveis
        unidadesTiposAvaliacoes.forEach(unidadeTipoAvaliacao ->
                this.avaliavelService.delete(this.avaliavelService.findAllByUnidadeTipoAvaliacaoId(unidadeTipoAvaliacao.getId()))
        );

        // Deleta Unidades Tipos Avaliações
        this.unidadeTipoAvaliacaoRepository.deleteInBatch(unidadesTiposAvaliacoes);
    }

    @Transactional
    public void delete(final long id) {
        this.unidadeTipoAvaliacaoRepository.deleteById(id);
    }

    public Page<UnidadeTipoAvaliacao> listByFilters(final String defaultFilter, final Long tipoAvaliacaoId, final Long unidadeId, final Boolean ativo, final Pageable pageable) {
        return this.unidadeTipoAvaliacaoRepository.listByFilters(defaultFilter, tipoAvaliacaoId, unidadeId, ativo, pageable);
    }

    List<UnidadeTipoAvaliacao> findAllByUnidadeId(final Long unidadeId) {
        return this.unidadeTipoAvaliacaoRepository.findAllByUnidadeId(unidadeId);
    }

    List<UnidadeTipoAvaliacao> findAllByTipoAvaliacaoId(final Long tipoAvaliacaoId) {
        return this.unidadeTipoAvaliacaoRepository.findAllByTipoAvaliacaoId(tipoAvaliacaoId);
    }

    public UnidadeTipoAvaliacao findByUnidadeIdAndTipoAvaliacaoId(final long unidadeId, final long tipoAvaliacaoId) {
        return this.unidadeTipoAvaliacaoRepository.findByUnidadeIdAndTipoAvaliacaoId(unidadeId, tipoAvaliacaoId);
    }
}
