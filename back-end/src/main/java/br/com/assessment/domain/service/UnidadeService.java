package br.com.assessment.domain.service;

import br.com.assessment.domain.entity.unidade.Unidade;
import br.com.assessment.domain.repository.UnidadeRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UnidadeService {

    private final UnidadeRepository unidadeRepository;


    public UnidadeService(final UnidadeRepository unidadeRepository) {
        this.unidadeRepository = unidadeRepository;
    }

    /**
     *
     */
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Mono<Unidade> save(final long id, final Mono<Unidade> unidade) {
        /**
         * todo PASSAR handler para a controler, isso está me incomodando ...
         */
        return Mono.create(monoSink ->
                unidade.subscribe(unidadeToSave -> {
                            if (unidadeToSave.getId() != null && unidadeToSave.getId().equals(id))
                                monoSink.success(this.unidadeRepository.save(unidadeToSave));
                            else
                                monoSink.error(new RuntimeException("Você não tem acesso a essa unidade"));
                        }
                )
        );
    }

    /**
     *
     */
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Mono<Unidade> save(final Mono<Unidade> unidade) {
        return Mono.create(monoSink ->
                unidade.subscribe(unidade1 ->
                        monoSink.success(this.unidadeRepository.save(unidade1))
                )
        );
    }

    /**
     * @param unidadeId
     */
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public void delete(final long unidadeId) {
        this.unidadeRepository.deleteById(unidadeId);
    }

    /**
     * @return
     */
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Mono<Optional<Unidade>> findById(final long unidadeId) {
        return Mono.just(this.unidadeRepository.findById(unidadeId));
    }

    /**
     * @return
     */
//    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Flux<Unidade> findAll() {

        final List<Unidade> list = this.unidadeRepository.findAll();

        return Flux.just(list.toArray(new Unidade[list.size()]));
    }
}