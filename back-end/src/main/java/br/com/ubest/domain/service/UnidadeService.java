package br.com.ubest.domain.service;

import br.com.ubest.application.hibernate.multitenancy.TenantIdentifierResolver;
import br.com.ubest.domain.entity.unidade.Unidade;
import br.com.ubest.domain.entity.usuario.Conta;
import br.com.ubest.domain.repository.ContaRepository;
import br.com.ubest.domain.repository.UnidadeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UnidadeService {

    private final ContaRepository contaRepository;

    private final OperadorService operadorService;

    private final UnidadeRepository unidadeRepository;

    private final TenantIdentifierResolver tenantIdentifierResolver;

    private final UnidadeTipoAvaliacaoService unidadeTipoAvaliacaoService;

    /**
     * @param id      long
     * @param unidade Unidade
     * @return Unidade
     */
    public Unidade save(final long id, final Unidade unidade) {
        Assert.isTrue(unidade.getId() != null && unidade.getId().equals(id), "Você não tem acesso a essa unidade"); //TODO colocar validator em uma service, e colocar na camada de cima
        return this.save(unidade);
    }

    /**
     * @param unidade Unidade
     * @return Unidade
     */
    public Unidade save(final Unidade unidade) {
        return this.unidadeRepository.save(unidade);
    }

    /**
     * @param unidadeId long
     */
    @Transactional
    public void delete(final long unidadeId) {

        // Deleta todos os operadores
        this.operadorService.delete(this.operadorService.findAllByUnidadeId(unidadeId));

        // Deleta todos os unidades tipos avaliações
        this.unidadeTipoAvaliacaoService.delete(this.unidadeTipoAvaliacaoService.findAllByUnidadeId(unidadeId));

        // Deleta unidade
        this.unidadeRepository.deleteById(unidadeId);
    }

    /**
     * @param id long
     * @return Optional<Unidade>
     */
    public Optional<Unidade> findById(final long id) {
        return Optional.of(this.unidadeRepository.findUnidadeByIdAndReturnAvaliacoes(id));
    }

    /**
     * @param defaultFilter     String
     * @param enderecoFilter    String
     * @param dataInicioFilter  String
     * @param dataTerminoFilter String
     * @param pageable          pageable
     * @return Page<Unidade>
     */
    public Page<Unidade> listByFilters(final String defaultFilter,
                                       final List<Long> tiposAvaliacoesFilter,
                                       final String enderecoFilter,
                                       final LocalDateTime dataInicioFilter,
                                       final LocalDateTime dataTerminoFilter,
                                       final Pageable pageable) {

        final Conta conta = contaRepository.findByEmailIgnoreCase(tenantIdentifierResolver.getUsername());

        final Long usuarioId = conta.isRoot() ? null : conta.getUsuario().getId();

        return this.unidadeRepository.listByFilters(
                usuarioId,
                conta.getPerfil().name(),
                defaultFilter,
                tiposAvaliacoesFilter,
                enderecoFilter,
                dataInicioFilter,
                dataTerminoFilter,
                pageable);

    }

    public Optional<Unidade> findUnidadeById(final Long unidadeId,
                                             final LocalDateTime dataInicioFilter,
                                             final LocalDateTime dataTerminoFilter) {

        return unidadeRepository.findUnidadeById(unidadeId, dataInicioFilter, dataTerminoFilter);

    }

    /**
     * @param defaultFilter String
     * @param pageable      Pageable
     * @return Page<Unidade>
     */
    public Page<Unidade> listByFilters(final String defaultFilter, final Boolean withBondFilter, final Boolean withAvaliaveisFilter, final Boolean withUnidadesTiposAvaliacoesAtivasFilter, final List<Long> idsFilter, final Pageable pageable) {

        final Conta conta = contaRepository.findByEmailIgnoreCase(tenantIdentifierResolver.getUsername());

        final Long usuarioId = conta.isRoot() ? null : conta.getUsuario().getId();

        return this.unidadeRepository.listByFilters(
                usuarioId,
                conta.getPerfil().name(),
                defaultFilter,
                withBondFilter,
                withAvaliaveisFilter,
                withUnidadesTiposAvaliacoesAtivasFilter,
                idsFilter,
                pageable);

    }

    /**
     * @param usuarioId long
     * @return List<Unidade>
     */
    public List<Unidade> listByUsuarioId(final long usuarioId) {
        return this.unidadeRepository.listByUsuarioId(usuarioId);
    }
}
