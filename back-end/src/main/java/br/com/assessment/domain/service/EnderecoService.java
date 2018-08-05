package br.com.assessment.domain.service;

import br.com.assessment.domain.entity.endereco.Cidade;
import br.com.assessment.domain.repository.EnderecoRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Optional;

@Service
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;

    public EnderecoService(final EnderecoRepository enderecoRepository) {
        this.enderecoRepository = enderecoRepository;
    }

    public Mono<Optional<Cidade>> find(final String cidade, final String uf) {
        return Mono.just(this.enderecoRepository.find(cidade, uf));
    }
}
