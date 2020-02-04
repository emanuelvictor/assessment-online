package online.meavalia.domain;

import lombok.RequiredArgsConstructor;
import online.meavalia.domain.entity.avaliacao.TipoAvaliacao;
import online.meavalia.domain.entity.avaliacao.UnidadeTipoAvaliacao;
import online.meavalia.domain.repository.TipoAvaliacaoRepository;
import online.meavalia.domain.repository.UnidadeTipoAvaliacaoDispositivoRepository;
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

    /**
     *
     */
    private final TipoAvaliacaoRepository tipoAvaliacaoRepository;

    /**
     *
     */
    private final UnidadeTipoAvaliacaoService unidadeTipoAvaliacaoService;

    /**
     *
     */
    private final UnidadeTipoAvaliacaoDispositivoRepository unidadeTipoAvaliacaoDispositivoRepository;

    /**
     * @param id
     * @return
     */
    public Optional<TipoAvaliacao> findById(final long id) {
        return this.tipoAvaliacaoRepository.findById(id);
    }

    /**
     * @param tipoTipoAvaliacao
     * @return
     */
    public TipoAvaliacao save(final TipoAvaliacao tipoTipoAvaliacao) {
        return this.tipoAvaliacaoRepository.save(tipoTipoAvaliacao);
    }

    /**
     * @param id
     * @param tipoTipoAvaliacao
     * @return
     */
    public TipoAvaliacao save(final long id, final TipoAvaliacao tipoTipoAvaliacao) {
        Assert.isTrue(id > 0, "ID da avaliação incorreto"); //TODO fazer o validador exclusivo
        return this.tipoAvaliacaoRepository.save(tipoTipoAvaliacao);
    }

    /**
     * @param id
     */
    @Transactional
    public void delete(final long id) {

        final List<UnidadeTipoAvaliacao> unidadesTiposAvaliacoes = this.unidadeTipoAvaliacaoService.findAllByTipoAvaliacaoId(id);

        unidadesTiposAvaliacoes.forEach(unidadeTipoAvaliacao -> {
            this.unidadeTipoAvaliacaoDispositivoRepository.deleteAll(this.unidadeTipoAvaliacaoDispositivoRepository.findAllByUnidadeTipoAvaliacaoId(id));
        });

        this.unidadeTipoAvaliacaoService.delete(unidadesTiposAvaliacoes);

        this.tipoAvaliacaoRepository.deleteById(id);
    }

    /**
     * @param defaultFilter
     * @param unidadesFilter
     * @param pageable
     * @return
     */
    public Page<TipoAvaliacao> listByFilters(final String defaultFilter, final List<Long> unidadesFilter, final Pageable pageable) {
        return this.tipoAvaliacaoRepository.listByFilters(defaultFilter, unidadesFilter, pageable);
    }

    /**
     * @param defaultFilter
     * @param idsFilter
     * @param pageable
     * @return
     */
    public Page<TipoAvaliacao> listLightByFilters(final String defaultFilter, final List<Long> idsFilter, final Pageable pageable) {
        return this.tipoAvaliacaoRepository.listLightByFilters(defaultFilter, idsFilter, pageable);
    }
}
