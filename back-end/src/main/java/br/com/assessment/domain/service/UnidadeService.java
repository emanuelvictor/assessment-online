package br.com.assessment.domain.service;

import br.com.assessment.application.context.LocalContext;
import br.com.assessment.application.exceptions.PasswordNotFound;
import br.com.assessment.domain.entity.unidade.Unidade;
import br.com.assessment.domain.entity.usuario.Conta;
import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.repository.ContaRepository;
import br.com.assessment.domain.repository.UnidadeRepository;
import br.com.assessment.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UnidadeService {

    private final ContaRepository contaRepository;

    private final PasswordEncoder passwordEncoder;

    private final UsuarioRepository usuarioRepository;

    private final UnidadeRepository unidadeRepository;

    private final OperadorService operadorService;

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
                                       final String enderecoFilter,
                                       final LocalDateTime dataInicioFilter,
                                       final LocalDateTime dataTerminoFilter,
                                       final Pageable pageable) {

        final Usuario usuario = contaRepository.findByEmailIgnoreCase(LocalContext.getCurrentUsername()).getUsuario();

        return this.unidadeRepository.listByFilters(
                usuario.getId(),
                usuario.getConta().getPerfil().name(),
                defaultFilter,
                enderecoFilter,
                dataInicioFilter,
                dataTerminoFilter,
                pageable);

    }

    /**
     * @param defaultFilter String
     * @param pageable      Pageable
     * @return Page<Unidade>
     */
    public Page<Unidade> listByFilters(final String defaultFilter, final Pageable pageable) {

        final Usuario usuario = contaRepository.findByEmailIgnoreCase(LocalContext.getCurrentUsername()).getUsuario();

        return this.unidadeRepository.listByFilters(
                usuario.getId(),
                usuario.getConta().getPerfil().name(),
                defaultFilter,
                pageable);

    }

    /**
     * @param usuarioId long
     * @return List<Unidade>
     */
    public List<Unidade> listByUsuarioId(final long usuarioId) {
        return this.unidadeRepository.listByUsuarioId(usuarioId);
    }

    /**
     * @param unidadeId long
     * @param password  String
     * @return boolean
     */
    public boolean authenticateByUnidadeId(final long unidadeId, final String password) {

        final Conta conta = this.contaRepository.findByEmailIgnoreCase(LocalContext.getCurrentUsername());
        if (conta.isAdministrador() && this.passwordEncoder.matches(password, conta.getPassword()))
            return true;

        final List<Usuario> usuarios = this.usuarioRepository.listUsuariosByUnidadeId(unidadeId);

        for (final Usuario usuario : usuarios)
            if (this.passwordEncoder.matches(password, usuario.getConta().getPassword()))
                return true;

        throw new PasswordNotFound();

    }

    /**
     * @param unidadeId long
     * @return boolean
     */
    public List<String> getHashsByUnidadeId(final long unidadeId) {

        final List<String> hashs = new ArrayList<>();

        hashs.addAll(this.unidadeRepository.getHashsByUnidadeId(unidadeId).stream().map(password ->
                password != null ? password : "sem-senha"
        ).collect(Collectors.toList()));

        hashs.addAll(this.usuarioRepository.getAdministrators().stream().map(usuario -> {
            if (usuario.getConta() != null && usuario.getConta().getPassword() != null)
                return usuario.getConta().getPassword();
            return "sem-senha";
        }).collect(Collectors.toList()));

        return hashs;
    }
}