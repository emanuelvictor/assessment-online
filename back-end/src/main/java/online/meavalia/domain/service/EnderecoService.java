package online.meavalia.domain.service;

import lombok.RequiredArgsConstructor;
import online.meavalia.domain.entity.endereco.Cidade;
import online.meavalia.domain.repository.EnderecoRepository;
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
