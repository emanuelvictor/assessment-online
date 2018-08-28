package br.com.assessment.domain.service;

import br.com.assessment.domain.entity.endereco.Cidade;
import br.com.assessment.domain.repository.EnderecoRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;

    public Optional<Cidade> find(final String cidade, final String uf) {
        return this.enderecoRepository.find(cidade, uf);
    }
}
