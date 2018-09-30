package br.com.assessment.domain.service;

import br.com.assessment.application.context.Context;
import br.com.assessment.domain.entity.configuracao.Configuracao;
import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.repository.ContaRepository;
import br.com.assessment.domain.repository.ConfiguracaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
