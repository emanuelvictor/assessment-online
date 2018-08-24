package br.com.assessment.domain.service;

import br.com.assessment.application.context.Context;
import br.com.assessment.domain.entity.unidade.Unidade;
import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.repository.ContaRepository;
import br.com.assessment.domain.repository.UnidadeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import reactor.core.publisher.Mono;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class UnidadeService {

    private final UnidadeRepository unidadeRepository;

    private final ContaRepository contaRepository;

    /**
     *
     * @param id
     * @param unidade
     * @return
     */
    public Mono<Unidade> save(final long id, final Unidade unidade) {
        Assert.isTrue(unidade.getId() != null && unidade.getId().equals(id), "Você não tem acesso a essa unidade");
        return this.save(unidade);
    }

    /**
     *
     * @param unidade
     * @return
     */
    public Mono<Unidade> save(final Unidade unidade) {
        return Mono.just(this.unidadeRepository.save(unidade));
    }

    /**
     *
     * @param id
     * @return
     */
    public Mono<Boolean> delete(final long id) {
        this.unidadeRepository.deleteById(id);
        return Mono.just(true);
    }

    /**
     *
     * @param id
     * @return
     */
    public Mono<Optional<Unidade>> findById(final long id) {
        return Mono.just(this.unidadeRepository.findById(id));
    }

    /**
     * @param defaultFilter  String
     * @param enderecoFilter String
     * @param pageable       Pageable
     * @return Page<Unidade>
     */
    public Page<Unidade> listByFilters(final String defaultFilter, final String enderecoFilter, final Pageable pageable) {

        final Usuario usuario = contaRepository.findByEmailIgnoreCase(Context.getCurrentUsername()).getUsuario();

        if (usuario.getIsAdministrador())
            return this.unidadeRepository.listByFilters(defaultFilter, enderecoFilter, pageable);

        else if (usuario.getIsOperador())
            return this.unidadeRepository.listByFiltersAndOperadorId(usuario.getId(), defaultFilter, enderecoFilter, pageable);

        else
            return this.unidadeRepository.listByFiltersAndAtendenteId(usuario.getId(), defaultFilter, enderecoFilter, pageable);
    }
}