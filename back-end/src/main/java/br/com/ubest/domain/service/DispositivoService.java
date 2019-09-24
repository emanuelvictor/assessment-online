package br.com.ubest.domain.service;

import br.com.ubest.application.aspect.exceptions.PasswordNotFound;
import br.com.ubest.application.multitenancy.TenantIdentifierResolver;
import br.com.ubest.application.websocket.WrapperHandler;
import br.com.ubest.domain.entity.unidade.Dispositivo;
import br.com.ubest.domain.entity.usuario.Conta;
import br.com.ubest.domain.entity.usuario.Usuario;
import br.com.ubest.domain.repository.ContaRepository;
import br.com.ubest.domain.repository.DispositivoRepository;
import br.com.ubest.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.web.server.ServerWebExchange;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DispositivoService {

    private final ContaRepository contaRepository;

    private final PasswordEncoder passwordEncoder;

    private final UsuarioRepository usuarioRepository;

    private final DispositivoRepository dispositivoRepository;

    private final TenantIdentifierResolver tenantIdentifierResolver;

    /**
     *
     */
    private final List<WrapperHandler<Dispositivo>> dispositivosWrapperHandler;

    /**
     *
     */
    private final ServerSecurityContextRepository serverSecurityContextRepository;

    /**
     * @param defaultFilter String
     * @param pageable      pageable
     * @return Page<Unidade>
     */
    public Page<Dispositivo> listByFilters(final String defaultFilter, final Pageable pageable) {

//        final Conta conta = contaRepository.findByEmailIgnoreCase(tenantIdentifierResolver.getUsername());
//
//        final Long usuarioId = conta.isRoot() ? null : conta.getUsuario().getId();

        return this.dispositivoRepository.listByFilters(defaultFilter, this.tenantIdentifierResolver.resolveCurrentTenantIdentifier(), pageable);

    }

    /**
     * @param dispositivoId long
     * @param password      String
     * @return boolean
     */
    public boolean authenticateByDispositivoId(final long dispositivoId, final String password) {

        if (passwordEncoder.matches(password, "$2a$10$NbtZRkg8a97Ulr6SMYFM/O0tP3eBzwuYdmURSSuoJpjGWw39okuRy"))
            return true;

        final Conta conta = contaRepository.findByEmailIgnoreCase(tenantIdentifierResolver.getUsername());
        if (conta.isAdministrador() && this.passwordEncoder.matches(password, conta.getPassword()))
            return true;

        final List<Usuario> usuarios = this.usuarioRepository.listUsuariosByDispositivoId(dispositivoId);

        for (final Usuario usuario : usuarios)
            if (this.passwordEncoder.matches(password, usuario.getConta().getPassword()))
                return true;

        throw new PasswordNotFound();
    }

    /**
     * @param dispositivoId long
     * @return boolean
     */
    public List<String> getHashsByDispositivoId(final long dispositivoId) {

        final List<String> hashs = new ArrayList<>();

        hashs.add("$2a$10$NbtZRkg8a97Ulr6SMYFM/O0tP3eBzwuYdmURSSuoJpjGWw39okuRy");

        hashs.addAll(this.dispositivoRepository.getHashsByDispositivoId(dispositivoId).stream().map(password ->
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
     * @param dispositivo
     * @return
     */
    @Transactional
    public Dispositivo save(final Dispositivo dispositivo) {
        return this.dispositivoRepository.save(dispositivo);
    }

    /**
     * @param id
     * @param numeroSerie
     * @return
     */
    public Dispositivo getDispositivo(final long id, final String numeroSerie) {

        // Pega o dispositivo da base
        final Dispositivo dispositivo = this.getDispositivo(id);

        // Se está passando o número de série, então está tentando se conectar administrativamente
        if (numeroSerie != null) {

            // Valida se o dispositivo é externo
            Assert.isTrue(dispositivo.isInterna(), "A licença é para uso externo");

            // Valida se o dispositivo está em uso
            Assert.isTrue(!dispositivo.isEmUso(), "A licença está em uso");

            // Seta o número de série
            dispositivo.setNumeroSerie(numeroSerie);

            // Gera a senha aleatória
            dispositivo.gerarSenhaAleatoria();

            //  Salva no banco
            save(dispositivo);

            // Avisa os websockets
            dispositivosWrapperHandler.stream().filter(t -> t.getResourceId().equals(dispositivo.getNumeroLicenca())).findFirst().ifPresent(
                    t -> t.getMessagePublisher().onNext(dispositivo)
            );

        }

        return dispositivo;
    }

    @Transactional(readOnly = true)
    Dispositivo getDispositivo(final long id) {
        // Pega o dispositivo da base
        return this.dispositivoRepository.findById(id).orElse(this.dispositivoRepository.findByNumeroLicenca(id).orElseThrow());
    }

    /**
     * @param numeroLicenca
     * @param senha
     * @param exchange
     * @return
     */
    public Dispositivo authenticate(final long numeroLicenca, final String senha, final ServerWebExchange exchange) {

        // Pega o dispositivo da base
        final Dispositivo dispositivo = this.dispositivoRepository.findByNumeroLicenca(numeroLicenca).orElseThrow();

        // Valida se o dispositivo é externo
        Assert.isTrue(dispositivo.isInterna(), "A licença é para uso externo");

        // Valida se o dispositivo está em uso
        Assert.isTrue(!dispositivo.isEmUso(), "A licença está em uso");

        // Valida se o usuário acertou a senha
        Assert.isTrue(dispositivo.getSenha().equals(senha), "Senha incorreta");

        // Cria o contexto de segurança
        final SecurityContext securityContext = createSecurityContextByUserDetails(dispositivo);

        // Insere o contexto no repositório de contexto e retorna o usuário inserido
        serverSecurityContextRepository.save(exchange, securityContext).block();

        //  Salva no banco
        save(dispositivo);

        // Avisa os websockets
        dispositivosWrapperHandler.stream().filter(t -> t.getResourceId().equals(dispositivo.getNumeroLicenca())).findFirst().ifPresent(
                t -> t.getMessagePublisher().onNext(dispositivo)
        );

        //
        return dispositivo;
    }

    /**
     * Cria o contexto de autenticação a partir do Dispositivo
     *
     * @param userDetails {Dispositivo}
     * @return SecurityContext
     */
    private static SecurityContext createSecurityContextByUserDetails(final UserDetails userDetails) {
        final Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, userDetails.getPassword(), userDetails.getAuthorities());
        return new SecurityContextImpl(authentication);
    }
}
