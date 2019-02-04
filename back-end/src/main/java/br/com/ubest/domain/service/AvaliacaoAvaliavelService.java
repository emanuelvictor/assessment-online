package br.com.ubest.domain.service;

import br.com.ubest.domain.entity.avaliacao.AvaliacaoAvaliavel;
import br.com.ubest.domain.repository.AvaliacaoAvaliavelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AvaliacaoAvaliavelService {

    private final AvaliacaoService avaliacaoService;

    private final AvaliacaoAvaliavelRepository avaliacaoAvaliavelRepository;

    /**
     * @param usuarioId long
     */
    void deleteByUsuarioId(final long usuarioId) {
        avaliacaoAvaliavelRepository.deleteInBatch(avaliacaoAvaliavelRepository.listAvaliacaoAvaliavelByUsuarioId(usuarioId));
    }

    /**
     * @param avaliacoesAvaliaveis List<AvaliacaoAvaliavel>
     */
    @Transactional
    void delete(final List<AvaliacaoAvaliavel> avaliacoesAvaliaveis) {

        // Deleta o avaliação avaliavel
        avaliacaoAvaliavelRepository.deleteInBatch(avaliacoesAvaliaveis);

    }

    /**
     * @param avaliavelId long
     * @return List<AvaliacaoAvaliavel>
     */
    List<AvaliacaoAvaliavel> findAllByAvaliavelId(final long avaliavelId) {
        return this.avaliacaoAvaliavelRepository.findAllByAvaliavelId(avaliavelId);
    }

}