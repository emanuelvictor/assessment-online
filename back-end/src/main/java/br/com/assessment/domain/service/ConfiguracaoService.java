package br.com.assessment.domain.service;

import br.com.assessment.domain.entity.configuracao.Configuracao;
import br.com.assessment.domain.repository.ConfiguracaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ConfiguracaoService {

    private final ConfiguracaoRepository configuracaoRepository;

    public Configuracao save(final long id, final Configuracao configuracao) {
        return this.save(configuracao);
    }

    public Configuracao save(final Configuracao configuracao) {
        return this.configuracaoRepository.save(configuracao);
    }

    public void delete(final long id) {
        this.configuracaoRepository.deleteById(id);
    }

    public List<Configuracao> findAll() {
        return this.configuracaoRepository.findAll();
    }

}
