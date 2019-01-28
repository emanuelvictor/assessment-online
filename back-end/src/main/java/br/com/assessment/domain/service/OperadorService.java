package br.com.assessment.domain.service;

import br.com.assessment.domain.entity.usuario.vinculo.Operador;
import br.com.assessment.domain.repository.OperadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OperadorService {

    private final OperadorRepository operadorRepository;

    private final AvaliacaoAvaliavelService avaliacaoAvaliavelService;

    public Optional<Operador> findById(final long id) {
        return this.operadorRepository.findById(id);
    }

    public Operador save(final Operador avaliavel) {
        return this.operadorRepository.save(avaliavel);
    }

    public Operador save(final long id, final Operador avaliavel) {
        Assert.isTrue(id > 0, "ID do avaliavel incorreto"); //TODO fazer o validador exclusivo
        return this.operadorRepository.save(avaliavel);
    }

    @Transactional
    public void delete(final List<Operador> operadores) {
        this.operadorRepository.deleteInBatch(operadores);
    }

    public void delete(final long id) {
        this.operadorRepository.deleteById(id);
    }

    void deleteByUsuarioId(final long usuarioId) {

        avaliacaoAvaliavelService.deleteByUsuarioId(usuarioId);

        operadorRepository.deleteInBatch(operadorRepository.listByFilters(null, null, usuarioId, null, null).getContent());
    }

    public Page<Operador> listByFilters(final String defaultFilter, final String enderecoFilter, final Long usuarioId, final Long unidadeId, final Pageable pageable) {
        return this.operadorRepository.listByFilters(defaultFilter, enderecoFilter, usuarioId, unidadeId, pageable);
    }

    List<Operador> findAllByUnidadeId(final Long unidadeId) {
        return this.operadorRepository.findAllByUnidadeId(unidadeId);
    }

}