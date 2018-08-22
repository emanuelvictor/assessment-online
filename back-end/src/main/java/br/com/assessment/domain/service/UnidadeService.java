package br.com.assessment.domain.service;

import br.com.assessment.domain.entity.unidade.Unidade;
import br.com.assessment.domain.repository.UnidadeRepository;
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
@Transactional
@RequiredArgsConstructor
public class UnidadeService {

    private final UnidadeRepository unidadeRepository;

    /**
     *
     */
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Mono<Unidade> save(final long id, final Unidade unidade) {
        Assert.isTrue(unidade.getId() != null && unidade.getId().equals(id), "Você não tem acesso a essa unidade");
        return this.save(unidade);
    }

    /**
     *
     */
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Mono<Unidade> save(final Unidade unidade) {
        return Mono.just(this.unidadeRepository.save(unidade));
    }

    /**
     * @param id
     */
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Mono<Boolean> delete(final long id) {
        this.unidadeRepository.deleteById(id);
        return Mono.just(true);
    }

    /**
     * @return
     */
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Mono<Optional<Unidade>> findById(final long id) {
        return Mono.just(this.unidadeRepository.findById(id));
    }

    /**
     * @return
     */
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Flux<Unidade> findAll() {

        final List<Unidade> list = this.unidadeRepository.findAll();

        return Flux.just(list.toArray(new Unidade[list.size()]));
    }

    public Mono<Page<Unidade>> listByFilters(final String filters, final Pageable pageable) {

        final Page<Unidade> page = this.unidadeRepository.listByFilters(filters, pageable);

        return Mono.just(page);
    }
}