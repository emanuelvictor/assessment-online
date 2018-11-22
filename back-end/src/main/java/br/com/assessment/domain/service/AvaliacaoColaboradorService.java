package br.com.assessment.domain.service;

import br.com.assessment.domain.repository.AvaliacaoColaboradorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AvaliacaoColaboradorService {

    private final AvaliacaoColaboradorRepository avaliacaoColaboradorRepository;

    public void deleteByUsuarioId(final long usuarioId) {

        avaliacaoColaboradorRepository.deleteInBatch(avaliacaoColaboradorRepository.listAvaliacaoColaboradorByUsuarioId(usuarioId));

    }

}