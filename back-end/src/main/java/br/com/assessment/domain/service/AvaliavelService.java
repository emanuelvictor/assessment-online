package br.com.assessment.domain.service;

import br.com.assessment.domain.entity.avaliacao.Avaliacao;
import br.com.assessment.domain.entity.avaliacao.AvaliacaoAvaliavel;
import br.com.assessment.domain.entity.usuario.vinculo.Avaliavel;
import br.com.assessment.domain.repository.AvaliavelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    public void delete(final List<Avaliavel> avaliaveis) {

        final List<AvaliacaoAvaliavel> avalicoesAvaliaveis = new ArrayList<>();

        // Deleta os avaliações avaliáveis
        avaliaveis.forEach(avaliavel -> {
                    final List<AvaliacaoAvaliavel> avalicoesAvaliaveisLocais = this.avaliacaoAvaliavelService.findAllByAvaliavelId(avaliavel.getId());
                    avalicoesAvaliaveis.addAll(avalicoesAvaliaveisLocais);
                    this.avaliacaoAvaliavelService.delete(avalicoesAvaliaveisLocais);
                }
        );

        // Deleta os avaliáveis
        this.avaliavelRepository.deleteInBatch(avaliaveis);

        // Deleta as avaliações
        this.avaliacaoService.delete(avalicoesAvaliaveis.stream().map(AvaliacaoAvaliavel::getAvaliacao).collect(Collectors.toList()));
    }

    public Page<Avaliavel> listByFilters(final String defaultFilter, final Long usuarioId, final Long unidadeId, final Long unidadeTipoAvaliacaoId, final Pageable pageable) {
        return this.avaliavelRepository.listByFilters(defaultFilter, usuarioId, unidadeId, unidadeTipoAvaliacaoId, pageable);
    }


    List<Avaliavel> findAllByUnidadeTipoAvaliacaoId(final Long unidadeTipoAvaliacaoId) {
        return this.avaliavelRepository.findAllByUnidadeTipoAvaliacaoId(unidadeTipoAvaliacaoId);
    }
}