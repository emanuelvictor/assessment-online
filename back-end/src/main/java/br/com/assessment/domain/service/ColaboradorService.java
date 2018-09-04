package br.com.assessment.domain.service;

import br.com.assessment.domain.entity.colaborador.Colaborador;
import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.repository.ColaboradorRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ColaboradorService {

    private final ColaboradorRepository colaboradorRepository;

    public Optional<Colaborador> findById(final long id) {
        return this.colaboradorRepository.findById(id);
    }

    public Colaborador save(final Colaborador colaborador) {
        return this.colaboradorRepository.save(colaborador);
    }

    public Colaborador save(final long id, final Colaborador colaborador) {
        Assert.isTrue(id > 0, "ID do colaborador incorreto"); //TODO fazer o validador exclusivo
        return this.colaboradorRepository.save(colaborador);
    }

    public void delete(final long id) {
        this.colaboradorRepository.deleteById(id);
    }

    public Page<Colaborador> listByFilters(final String defaultFilter, final String enderecoFilter, final Long usuarioId, final Long unidadeId, final Pageable pageable) {
        return this.colaboradorRepository.listByFilters(defaultFilter, enderecoFilter, usuarioId, unidadeId, pageable);
    }
    
}