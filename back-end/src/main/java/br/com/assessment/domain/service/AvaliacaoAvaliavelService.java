package br.com.assessment.domain.service;

import br.com.assessment.domain.repository.AvaliacaoAvaliavelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AvaliacaoAvaliavelService {

    private final AvaliacaoAvaliavelRepository avaliacaoAvaliavelRepository;

    public void deleteByUsuarioId(final long usuarioId) {

        avaliacaoAvaliavelRepository.deleteInBatch(avaliacaoAvaliavelRepository.listAvaliacaoAvaliavelByUsuarioId(usuarioId));

    }

}