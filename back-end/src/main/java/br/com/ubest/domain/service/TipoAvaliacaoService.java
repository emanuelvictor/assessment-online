package br.com.ubest.domain.service;

import br.com.ubest.application.multitenancy.TenantIdentifierResolver;
import br.com.ubest.application.websocket.WrapperHandler;
import br.com.ubest.domain.entity.avaliacao.TipoAvaliacao;
import br.com.ubest.domain.entity.unidade.Dispositivo;
import br.com.ubest.domain.repository.TipoAvaliacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class TipoAvaliacaoService {

    public final EntityManager entityManager;

    public final TenantIdentifierResolver tenantIdentifierResolver;

    private final UnidadeTipoAvaliacaoService unidadeTipoAvaliacaoService;

    private final TipoAvaliacaoRepository tipoAvaliacaoRepository;

    private final List<WrapperHandler<TipoAvaliacao>> tiposAvaliacoesWrapperHandler;

    public Optional<TipoAvaliacao> findById(final long id) {
        return this.tipoAvaliacaoRepository.findById(id);
    }

    public TipoAvaliacao save(final TipoAvaliacao tipoTipoAvaliacao) {
        return this.tipoAvaliacaoRepository.save(tipoTipoAvaliacao);
    }

    public TipoAvaliacao save(final long id, final TipoAvaliacao tipoTipoAvaliacao) {
        Assert.isTrue(id > 0, "ID da avaliação incorreto"); //TODO fazer o validador exclusivo

        tipoTipoAvaliacao.setId(id);

        tipoAvaliacaoRepository.save(tipoTipoAvaliacao);

        tiposAvaliacoesWrapperHandler.stream().filter(tipoAvaliacaoWrapperHandler -> tipoAvaliacaoWrapperHandler.getResourceId() == id).findFirst().orElseThrow().getMessagePublisher().onNext(tipoTipoAvaliacao);

        return tipoTipoAvaliacao;
    }

    @Transactional
    public void delete(final long id) {

        this.unidadeTipoAvaliacaoService.delete(this.unidadeTipoAvaliacaoService.findAllByTipoAvaliacaoId(id));

        this.tipoAvaliacaoRepository.deleteById(id);
    }

    public Page<TipoAvaliacao> listByFilters(final String defaultFilter, final List<Long> unidadesFilter, final Pageable pageable) {
        return this.tipoAvaliacaoRepository.listByFilters(defaultFilter, unidadesFilter, pageable);
    }

    public Page<TipoAvaliacao> listLightByFilters(final String defaultFilter, final List<Long> idsFilter, final Pageable pageable) {
        return this.tipoAvaliacaoRepository.listLightByFilters(defaultFilter, idsFilter, pageable);
    }
}
