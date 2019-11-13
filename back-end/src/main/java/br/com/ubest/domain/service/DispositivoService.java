package br.com.ubest.domain.service;

import br.com.ubest.application.tenant.TenantIdentifierResolver;
import br.com.ubest.application.websocket.WrapperHandler;
import br.com.ubest.domain.entity.unidade.Dispositivo;
import br.com.ubest.domain.repository.DispositivoRepository;
import br.com.ubest.domain.repository.UnidadeTipoAvaliacaoDispositivoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.web.server.ServerWebExchange;

import java.time.LocalDateTime;
import java.util.*;

import static java.util.Map.entry;

@Service
@RequiredArgsConstructor
public class DispositivoService {

    /**
     *
     */
    private final AvaliavelService avaliavelService;

    /**
     *
     */
    private final DispositivoRepository dispositivoRepository;

    /**
     *
     */
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
     *
     */
    private final UnidadeTipoAvaliacaoDispositivoRepository unidadeTipoAvaliacaoDispositivoRepository;

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
     * Método utilizado para gerar senha aleatória
     *
     * @param numeroLicenca
     * @param numeroSerie
     * @return
     */
    public Dispositivo getDispositivo(final long numeroLicenca, final String numeroSerie) {

        // Pega o dispositivo da base
        final Dispositivo dispositivo = this.getDispositivo(numeroLicenca);

        // Se está passando o número de série e o dispositivo é interno, então está tentando se conectar administrativamente
        if (numeroSerie != null) {

            if (dispositivo.getNumeroSerie() != null && !dispositivo.getNumeroSerie().equals(numeroSerie))
                throw new RuntimeException("Essa licença está sendo utilizada por outro dispositivo");

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

    /**
     * @param codigo
     * @return
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getLicencaAndSenhaByCodigo(final String codigo, final String numeroSerie) {

        Assert.notNull(codigo, "Código obrigatório!");
        Assert.notNull(numeroSerie, "Número de série obrigatório!");

        final Dispositivo dispositivo = this.dispositivoRepository.findByCodigo(UUID.fromString(codigo));

        Assert.notNull(dispositivo, "Código inválido!");
        Assert.isTrue(!dispositivo.getCodigoExpiration().isBefore(LocalDateTime.now().minusHours(1)), "Código expirado!"); //TODO arrumar data da aplicação

        Assert.isTrue(dispositivo.getNumeroSerie() == null || dispositivo.getNumeroSerie().equals(numeroSerie), "Essa licença está sendo utilizada em outro dispositivo");

        return new HashMap<>() {{
            put("numeroLicenca", dispositivo.getNumeroLicenca());
            put("senha", dispositivo.getSenha());
        }};

    }

    /**
     * Carrega todas as informações necessárias do dispositivo para o funcionamento das avaliações.
     * Alterna entre os tenant's.
     *
     * @param id
     * @return
     */
    public Dispositivo getDispositivo(final long id) {
        // Pega o dispositivo da base
        Dispositivo dispositivo = this.dispositivoRepository.findByNumeroLicenca(id).orElse(null);
        if (dispositivo == null)
            dispositivo = this.dispositivoRepository.findById(id).orElse(null);

        Assert.notNull(dispositivo, "Não encontrado");

        // Seta o tenant atual do dispositivo
        this.tenantIdentifierResolver.setSchema(dispositivo.getTenant());
        dispositivo = this.loadDispositivo(dispositivo);

        return dispositivo;
    }

    /**
     * Carrega todas as informações necessárias do dispositivo para o funcionamento das avaliações.
     *
     * @param dispositivo
     */
    @Transactional(readOnly = true)
    Dispositivo loadDispositivo(final Dispositivo dispositivo) {
        dispositivo.setUnidadesTiposAvaliacoesDispositivo(new HashSet<>(this.unidadeTipoAvaliacaoDispositivoRepository.listByFilters(null, dispositivo.getId(), null, true, true, null).getContent()));
        dispositivo.getUnidadesTiposAvaliacoesDispositivo().forEach(unidadeTipoAvaliacaoDispositivo ->
                unidadeTipoAvaliacaoDispositivo.setAvaliaveis(new HashSet<>(this.avaliavelService.listByFilters(null, null, null, true, unidadeTipoAvaliacaoDispositivo.getId(), null).getContent()))
        );
        return dispositivo;
    }

    /**
     * @param numeroLicenca
     * @param senha
     * @param exchange
     * @return
     */
    public Dispositivo authenticate(final long numeroLicenca, final String numeroSerie, final String senha, final ServerWebExchange exchange) {

        // Pega o dispositivo da base
        final Dispositivo dispositivo = this.dispositivoRepository.findByNumeroLicenca(numeroLicenca).orElseThrow();

        // Verifico se a licença está sendo utilizada por outro aplicativo
        if (dispositivo.getNumeroSerie() != null && !dispositivo.getNumeroSerie().equals(numeroSerie))
            throw new RuntimeException("Essa licença está sendo utilizada por outro dispositivo");

        //  seto o número de série aqui, e somente aqui, não n o carramento do dispositivo
        dispositivo.setNumeroSerie(numeroSerie);

        // Valida se o usuário acertou a senha
        Assert.isTrue(dispositivo.getSenha().equals(senha), "Senha incorreta!");

        //  Salva no banco
        save(dispositivo);

        // Cria o contexto de segurança
        final SecurityContext securityContext = createSecurityContextByUserDetails(dispositivo);

        // Insere o contexto no repositório de contexto e retorna o usuário inserido
        serverSecurityContextRepository.save(exchange, securityContext).block();

        // Avisa os websockets
        dispositivosWrapperHandler.stream().filter(t -> t.getResourceId().equals(dispositivo.getNumeroLicenca())).findFirst().ifPresent(
                t -> t.getMessagePublisher().onNext(dispositivo)
        );

        //
        return dispositivo;
    }

    /**
     * @param numeroSerie
     * @return
     */
    public Dispositivo desvincular(final String numeroSerie) {

        final Dispositivo dispositivo = this.dispositivoRepository.findByNumeroSerie(numeroSerie).orElseThrow();

        dispositivo.setNumeroSerie(null);
        dispositivo.setSenha(null);

        this.save(dispositivo);

        // Avisa os websockets
        dispositivosWrapperHandler.stream().filter(t -> t.getResourceId().equals(dispositivo.getNumeroLicenca())).findFirst().ifPresent(
                t -> t.getMessagePublisher().onNext(dispositivo)
        );

        return dispositivo;
    }

    /**
     * @param dispositivo
     * @return
     */
    @Transactional
    public Dispositivo save(final Dispositivo dispositivo) {
        this.tenantIdentifierResolver.setSchema(dispositivo.getTenant());
        return this.dispositivoRepository.save(dispositivo);
    }
}
