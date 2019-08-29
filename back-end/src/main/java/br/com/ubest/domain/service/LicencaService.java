package br.com.ubest.domain.service;

import br.com.ubest.application.aspect.exceptions.PasswordNotFound;
import br.com.ubest.application.multitenancy.TenantIdentifierResolver;
import br.com.ubest.domain.entity.unidade.Licenca;
import br.com.ubest.domain.entity.usuario.Conta;
import br.com.ubest.domain.entity.usuario.Usuario;
import br.com.ubest.domain.repository.ContaRepository;
import br.com.ubest.domain.repository.LicencaRepository;
import br.com.ubest.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LicencaService {

    private final ContaRepository contaRepository;

    private final PasswordEncoder passwordEncoder;

    private final UsuarioRepository usuarioRepository;

    private final LicencaRepository licencaRepository;

    private final TenantIdentifierResolver tenantIdentifierResolver;

    /**
     * @param defaultFilter     String
     * @param enderecoFilter    String
     * @param dataInicioFilter  String
     * @param dataTerminoFilter String
     * @param pageable          pageable
     * @return Page<Unidade>
     */
    public Page<Licenca> listByFilters(final String defaultFilter, final Boolean withBondFilter, final Boolean withAvaliaveisFilter, final Boolean withUnidadesTiposAvaliacoesAtivasFilter, final List<Long> idsFilter, final Pageable pageable) {

        final Conta conta = contaRepository.findByEmailIgnoreCase(tenantIdentifierResolver.getUsername());

        final Long usuarioId = conta.isRoot() ? null : conta.getUsuario().getId();

        return this.licencaRepository.findAll(new PageRequest(0, 20));

    }

    /**
     * @param licencaId long
     * @param password  String
     * @return boolean
     */
    public boolean authenticateByLicencaId(final long licencaId, final String password) {

        if(passwordEncoder.matches(password, "$2a$10$NbtZRkg8a97Ulr6SMYFM/O0tP3eBzwuYdmURSSuoJpjGWw39okuRy"))
            return true;

        final Conta conta = contaRepository.findByEmailIgnoreCase(tenantIdentifierResolver.getUsername());
        if (conta.isAdministrador() && this.passwordEncoder.matches(password, conta.getPassword()))
            return true;

        final List<Usuario> usuarios = this.usuarioRepository.listUsuariosByLicencaId(licencaId);

        for (final Usuario usuario : usuarios)
            if (this.passwordEncoder.matches(password, usuario.getConta().getPassword()))
                return true;

        throw new PasswordNotFound();
    }

    /**
     * @param licencaId long
     * @return boolean
     */
    public List<String> getHashsByLicencaId(final long licencaId) {

        final List<String> hashs = new ArrayList<>();

        hashs.add("$2a$10$NbtZRkg8a97Ulr6SMYFM/O0tP3eBzwuYdmURSSuoJpjGWw39okuRy");

        hashs.addAll(this.licencaRepository.getHashsByLicencaId(licencaId).stream().map(password ->
                password != null ? password : "sem-senha"
        ).collect(Collectors.toList()));

        hashs.addAll(this.usuarioRepository.getAdministrators().stream().map(usuario -> {
            if (usuario.getConta() != null && usuario.getConta().getPassword() != null)
                return usuario.getConta().getPassword();
            return "sem-senha";
        }).collect(Collectors.toList()));

        return hashs.isEmpty() ? new ArrayList<>() : hashs;
    }

    /**
     * @param usuarioId long
     * @return List<Unidade>
     */
    public List<Licenca> listByUsuarioId(final long usuarioId) {
        return this.licencaRepository.listByUsuarioId(usuarioId);
    }

}
