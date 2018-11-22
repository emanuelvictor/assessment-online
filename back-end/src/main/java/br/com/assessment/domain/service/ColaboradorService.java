package br.com.assessment.domain.service;

import br.com.assessment.domain.entity.colaborador.Colaborador;
import br.com.assessment.domain.entity.colaborador.Vinculo;
import br.com.assessment.domain.repository.ColaboradorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ColaboradorService {

    private final ColaboradorRepository colaboradorRepository;

    private final AvaliacaoColaboradorService avaliacaoColaboradorService;

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

    public void deleteByUsuarioId(final long usuarioId){

        avaliacaoColaboradorService.deleteByUsuarioId(usuarioId);

        colaboradorRepository.deleteInBatch(colaboradorRepository.listByFilters(null, null, usuarioId, null, null, null).getContent());
    }

    public Page<Colaborador> listByFilters(final String defaultFilter, final String enderecoFilter, final Long usuarioId, final Long unidadeId, final Vinculo vinculo, final Pageable pageable) {
        return this.colaboradorRepository.listByFilters(defaultFilter, enderecoFilter, usuarioId, unidadeId, vinculo, pageable);
    }

}