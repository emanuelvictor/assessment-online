package br.com.ubest.domain.service;

import br.com.ubest.application.multitenancy.TenantIdentifierResolver;
import br.com.ubest.domain.entity.unidade.Unidade;
import br.com.ubest.domain.repository.ContaRepository;
import br.com.ubest.domain.repository.UnidadeRepository;
import br.com.ubest.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UnidadeService {

    private final UnidadeRepository unidadeRepository;

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
     * @param dataInicioFilter  String
     * @param dataTerminoFilter String
     * @param pageable          pageable
     * @return Page<Unidade>
     */
    public Page<Unidade> listByFilters(final String defaultFilter,
                                       final List<Long> tiposAvaliacoesFilter,
                                       final LocalDateTime dataInicioFilter,
                                       final LocalDateTime dataTerminoFilter,
                                       final Pageable pageable) {

        return this.unidadeRepository.listByFilters(
                defaultFilter,
                tiposAvaliacoesFilter,
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

        return this.unidadeRepository.listByFilters(
                defaultFilter,
                withBondFilter,
                withAvaliaveisFilter,
                withUnidadesTiposAvaliacoesAtivasFilter,
                idsFilter,
                pageable);

    }

    List<Unidade> findByNome(final String nome) {
        return unidadeRepository.findByNome(nome);
    }
}
