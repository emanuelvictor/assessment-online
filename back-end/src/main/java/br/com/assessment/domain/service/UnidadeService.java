package br.com.assessment.domain.service;

import br.com.assessment.application.context.Context;
import br.com.assessment.application.exceptions.PasswordNotFound;
import br.com.assessment.domain.entity.unidade.Unidade;
import br.com.assessment.domain.entity.usuario.Conta;
import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UnidadeService {

    private final ContaRepository contaRepository;

    private final PasswordEncoder passwordEncoder;

    private final UsuarioRepository usuarioRepository;

    private final UnidadeRepository unidadeRepository;

    private final ColaboradorRepository colaboradorRepository;

    private final AvaliacaoColaboradorRepository avaliacaoColaboradorRepository;

    public Unidade save(final long id, final Unidade unidade) {
        Assert.isTrue(unidade.getId() != null && unidade.getId().equals(id), "Você não tem acesso a essa unidade"); //TODO colocar validator em uma service, e colocar na camada de cima
        return this.save(unidade);
    }

    public Unidade save(final Unidade unidade) {
        return this.unidadeRepository.save(unidade);
    }

    public void delete(final long unidadeId) {

        this.avaliacaoColaboradorRepository.deleteInBatch(this.avaliacaoColaboradorRepository.listAvaliacaoColaboradorByUnidadeId(unidadeId));

        this.colaboradorRepository.deleteInBatch(colaboradorRepository.listByFilters(null, null, null, unidadeId, null, null).getContent());

        this.unidadeRepository.deleteById(unidadeId);
    }

    public Optional<Unidade> findById(final long id) {
        return Optional.of(this.unidadeRepository.findUnidadeByIdAndReturnAvaliacoes(id));
    }

    public Page<Unidade> listByFilters(final String defaultFilter,
                                       final String enderecoFilter,
                                       final LocalDateTime dataInicioFilter,
                                       final LocalDateTime dataTerminoFilter,
                                       final Pageable pageable) {

        final Usuario usuario = contaRepository.findByEmailIgnoreCase(Context.getCurrentUsername()).getUsuario();

        return this.unidadeRepository.listByFilters(
                usuario.getId(),
                usuario.getConta().getPerfil().name(),
                defaultFilter,
                enderecoFilter,
                dataInicioFilter,
                dataTerminoFilter,
                pageable);

    }

    public Page<Unidade> listByFilters(final String defaultFilter,
                                       final Pageable pageable) {

        final Usuario usuario = contaRepository.findByEmailIgnoreCase(Context.getCurrentUsername()).getUsuario();

        return this.unidadeRepository.listByFilters(
                usuario.getId(),
                usuario.getConta().getPerfil().name(),
                defaultFilter,
                pageable);

    }

    public List<Unidade> findByNome(final String nome) {
        return this.unidadeRepository.findByNome(nome);
    }

    /**
     * @param unidadeId long
     * @param password  String
     * @return boolean
     */
    public boolean authenticateByUnidadeId(final long unidadeId, final String password) {

        final Conta conta = this.contaRepository.findByEmailIgnoreCase(Context.getCurrentUsername());
        if (conta.isAdministrador() && this.passwordEncoder.matches(password, conta.getPassword()))
            return true;

        final List<Usuario> usuarios = this.usuarioRepository.listUsuariosByUnidadeId(unidadeId);

        for (final Usuario usuario : usuarios)
            if (this.passwordEncoder.matches(password, usuario.getConta().getPassword()))
                return true;

        throw new PasswordNotFound();

    }
}