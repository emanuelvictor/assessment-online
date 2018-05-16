package br.com.assessment.domain.service;

import br.com.assessment.domain.entity.endereco.Cidade;
import br.com.assessment.domain.repository.IEnderecoRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Optional;

@Service
public class EnderecoService {

    private final IEnderecoRepository enderecoRepository;

    public EnderecoService(final IEnderecoRepository enderecoRepository) {
        this.enderecoRepository = enderecoRepository;
    }

    public Mono<Optional<Cidade>> find(final String cidade, final String uf) {
        return Mono.just(this.enderecoRepository.find(cidade, uf));
    }
}
