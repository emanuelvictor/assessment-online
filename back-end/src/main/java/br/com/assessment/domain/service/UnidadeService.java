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

    public Unidade save(final long id, final Unidade unidade) {
        Assert.isTrue(unidade.getId() != null && unidade.getId().equals(id), "Você não tem acesso a essa unidade"); //TODO colocar validator em uma service, e colocar na camada de cima
        return this.save(unidade);
    }

    public Unidade save(final Unidade unidade) {
        return this.unidadeRepository.save(unidade);
    }

    public void delete(final long id) {
        this.unidadeRepository.deleteById(id);
    }

    public Optional<Unidade> findById(final long id) {
        return this.unidadeRepository.findById(id);
    }

    // TODO passar prâmetros de perfil e id do usuário pra dentro da query
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