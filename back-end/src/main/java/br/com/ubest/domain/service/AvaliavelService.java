package br.com.ubest.domain.service;

import br.com.ubest.domain.entity.avaliacao.AvaliacaoAvaliavel;
import br.com.ubest.domain.entity.usuario.vinculo.Avaliavel;
import br.com.ubest.domain.repository.AvaliavelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AvaliavelService {

    private final AvaliacaoService avaliacaoService;

    private final AvaliavelRepository avaliavelRepository;

    private final AvaliacaoAvaliavelService avaliacaoAvaliavelService;


    public Optional<Avaliavel> findById(final long id) {
        return this.avaliavelRepository.findById(id);
    }

    public Avaliavel save(final Avaliavel avaliavel) {
        return this.avaliavelRepository.save(avaliavel);
    }

    public List<Avaliavel> save(final List<Avaliavel> avaliaveis) {
        return this.avaliavelRepository.saveAll(avaliaveis);
    }

    public Avaliavel save(final long id, final Avaliavel avaliavel) {
        Assert.isTrue(id > 0, "ID do avaliavel incorreto"); //TODO fazer o validador exclusivo
        return this.avaliavelRepository.save(avaliavel);
    }

    @Transactional
    public void delete(final long id) {

        // Deleta os avaliações avaliáveis
        this.avaliacaoAvaliavelService.delete(this.avaliacaoAvaliavelService.findAllByAvaliavelId(id));

        // Deleta o avaliável
        this.avaliavelRepository.deleteById(id);
    }

    @Transactional
    public void delete(final Set<Avaliavel> avaliaveis) {

//        final List<AvaliacaoAvaliavel> avalicoesAvaliaveis = new ArrayList<>();

        // Deleta os avaliações avaliáveis
        avaliaveis.forEach(avaliavel -> {
                    final List<AvaliacaoAvaliavel> avalicoesAvaliaveisLocais = this.avaliacaoAvaliavelService.findAllByAvaliavelId(avaliavel.getId());
//                    avalicoesAvaliaveis.addAll(avalicoesAvaliaveisLocais);
                    this.avaliacaoAvaliavelService.delete(avalicoesAvaliaveisLocais);
                }
        );

        // Deleta os avaliáveis
        this.avaliavelRepository.deleteInBatch(avaliaveis);

    }

    public Page<Avaliavel> listByFilters(final String defaultFilter, final Long usuarioId, final Long unidadeId, final Boolean ativo, final Long unidadeTipoAvaliacaoDispositivoId, final Pageable pageable) {
        return this.avaliavelRepository.listByFilters(defaultFilter, usuarioId, unidadeId, ativo, unidadeTipoAvaliacaoDispositivoId, pageable);
    }


    Set<Avaliavel> findAllByUnidadeTipoAvaliacaoId(final Long unidadeTipoAvaliacaoId) {
        return this.avaliavelRepository.findAllByUnidadeTipoAvaliacaoId(unidadeTipoAvaliacaoId);
    }

    Set<Avaliavel> findAllByUsuarioId(final Long usuarioId) {
        return this.avaliavelRepository.findAllByUsuarioId(usuarioId);
    }
}
