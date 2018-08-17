package br.com.assessment.domain.service;

import br.com.assessment.domain.entity.colaborador.Colaborador;
import br.com.assessment.domain.repository.ColaboradorRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ColaboradorService {

    private final ColaboradorRepository colaboradorRepository;

    public ColaboradorService(final ColaboradorRepository colaboradorRepository) {
        this.colaboradorRepository = colaboradorRepository;
    }

    /**
     *
     */
    public Mono<Optional<Colaborador>> findById(final long id) {
        return Mono.just(this.colaboradorRepository.findById(id));
    }

    /**
     *
     */
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Mono<Colaborador> save(final Colaborador colaborador) {
        return Mono.just(this.colaboradorRepository.save(colaborador));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public void delete(final long id) {
        this.colaboradorRepository.deleteById(id);
    }

    @PreAuthorize("hasRole('ATENDENTE')")
    public Flux<Colaborador> findAll() {

        final List<Colaborador> list = this.colaboradorRepository.findAll();

        return Flux.just(list.toArray(new Colaborador[list.size()]));
    }
    
}