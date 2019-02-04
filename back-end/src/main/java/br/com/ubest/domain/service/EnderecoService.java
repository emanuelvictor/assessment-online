package br.com.ubest.domain.service;

import br.com.ubest.domain.entity.endereco.Cidade;
import br.com.ubest.domain.repository.EnderecoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;

    public Optional<Cidade> find(final String cidade, final String uf) {
        return this.enderecoRepository.find(cidade, uf);
    }
}
