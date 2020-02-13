package online.meavalia.domain.service;

import lombok.RequiredArgsConstructor;
import online.meavalia.application.aspect.exceptions.PasswordNotFound;
import online.meavalia.application.tenant.TenantIdentifierResolver;
import online.meavalia.domain.entity.avaliacao.TipoAvaliacao;
import online.meavalia.domain.entity.avaliacao.UnidadeTipoAvaliacao;
import online.meavalia.domain.entity.configuracao.Configuracao;
import online.meavalia.domain.entity.unidade.Dispositivo;
import online.meavalia.domain.entity.unidade.Unidade;
import online.meavalia.domain.entity.unidade.UnidadeTipoAvaliacaoDispositivo;
import online.meavalia.domain.entity.usuario.Conta;
import online.meavalia.domain.entity.usuario.Usuario;
import online.meavalia.domain.entity.usuario.vinculo.Avaliavel;
import online.meavalia.domain.repository.*;
import online.meavalia.infrastructure.file.ImageUtils;
import online.meavalia.infrastructure.hibernate.multitenancy.FlywaySchemaInitializer;
import org.apache.commons.io.IOUtils;
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

import java.io.IOException;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static online.meavalia.Application.DEFAULT_TENANT_ID;
import static org.springframework.security.web.server.context.WebSessionServerSecurityContextRepository.DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME;


@Service
@RequiredArgsConstructor
public class UsuarioService {

    /**
     *
     */
    private final UnidadeService unidadeService;

    /**
     *
     */
    private final ContaRepository contaRepository;

    /**
     *
     */
    private final PasswordEncoder passwordEncoder;

    /**
     *
     */
    private final OperadorService operadorService;

    /**
     *
     */
    private final RecaptchaService recaptchaService;

    /**
     *
     */
    private final AvaliavelService avaliavelService;

    /**
     *
     */
    private final UsuarioRepository usuarioRepository;

    /**
     *
     */
    private final TipoAvaliacaoService tipoAvaliacaoService;


    /**
     *
     */
    private final DispositivoRepository dispositivoRepository;

    /**
     *
     */
    private final ConfiguracaoRepository configuracaoRepository;

    /**
     *
     */
    private final FlywaySchemaInitializer flywaySchemaInitializer;

    /**
     *
     */
    private final TenantIdentifierResolver tenantIdentifierResolver;

    /**
     *
     */
    private final UnidadeTipoAvaliacaoService unidadeTipoAvaliacaoService;

    /**
     *
     */
    private final ServerSecurityContextRepository serverSecurityContextRepository;

    /**
     *
     */
    private final UnidadeTipoAvaliacaoDispositivoRepository unidadeTipoAvaliacaoDispositivoRepository;

    /**
     * Cria o contexto de autenticação a partir do UserDetails
     *
     * @param userDetails {UserDetails}
     * @return SecurityContext
     */
    private static SecurityContext createSecurityContextByUserDetails(final UserDetails userDetails) {
        final Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, userDetails.getPassword(), userDetails.getAuthorities());
        return new SecurityContextImpl(authentication);
    }

    /**
     * Serviço de alteração de senha
     *
     * @param usuarioId   Long
     * @param password    String
     * @param newPassword String
     * @return Usuario
     */
    public Usuario changePassword(final long usuarioId, final String password, final String newPassword) {

        final Conta loggedAccount = contaRepository.findByEmailIgnoreCase(tenantIdentifierResolver.getUsername());

        // Minha conta
        if (loggedAccount.getUsuario() != null && loggedAccount.getUsuario().getId().equals(usuarioId)) {

            if (password != null && passwordEncoder.matches(password, loggedAccount.getPassword())) {
                loggedAccount.setPassword(passwordEncoder.encode(newPassword));
                contaRepository.save(loggedAccount);
                return usuarioRepository.findById(usuarioId).orElse(null);
            } else if (password == null) {
                loggedAccount.setPassword(passwordEncoder.encode(newPassword));
                contaRepository.save(loggedAccount);
                return usuarioRepository.findById(usuarioId).orElse(null);
            }


            throw new PasswordNotFound();

        }

        // Conta de um atendente, operador ou administrador meu
        else if (!loggedAccount.isAdministrador() && loggedAccount.getIsOperador()) {

            final List<Usuario> meusUsuarios = usuarioRepository.listByFilters(loggedAccount.getUsuario().getId(), loggedAccount.getPerfil().name(), null, null, null, null, null, null).getContent();

            for (final Usuario meuUsuario : meusUsuarios)
                if (meuUsuario.getId().equals(usuarioId)) {
                    final Conta conta = contaRepository.findByEmailIgnoreCase(meuUsuario.getConta().getUsername());
                    conta.setPassword(passwordEncoder.encode(newPassword));
                    contaRepository.save(conta);
                    meuUsuario.setConta(conta);
                    return meuUsuario;
                }

            throw new PasswordNotFound();

        }
        // Se eu for administrador, altero de quem eu quiser
        else {

            final Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);
            final Conta conta = contaRepository.findById(Objects.requireNonNull(usuario).getConta().getId()).orElse(null);
            Objects.requireNonNull(conta).setPassword(passwordEncoder.encode(newPassword));
            usuario.setConta(conta);
            contaRepository.save(conta);
            return usuario;

        }

    }

    /**
     * @param id      long
     * @param usuario Usuario
     * @return Usuario
     */
    public Usuario save(final ServerWebExchange exchange, final long id, final Usuario usuario) {

        Assert.isTrue(usuario.getId() != null && usuario.getId().equals(id), "Você não tem acesso á esse usuário");

        final Usuario usuarioDB = usuarioRepository.findById(usuario.getId()).orElse(null);

        if (Objects.requireNonNull(usuarioDB).getConta() != null && usuarioDB.getConta().getEmail() == null) {
            if (usuario.getConta().getPassword() != null)
                usuario.getConta().setPassword(passwordEncoder.encode(usuario.getConta().getPassword()));
        } else {
            usuario.getConta().setPassword(usuarioDB.getConta().getPassword());
        }

        // Reinsere a fotografia, as fotos devem ser atualizadas com seus respectivos services.
        usuario.setFoto(usuarioDB.getFoto());
        usuario.setThumbnail(usuarioDB.getThumbnail());
        usuario.setAvatar(usuarioDB.getAvatar());

        usuarioRepository.save(usuario);

        // Se estiver atualizando a própria conta, deve atualizar a sessão. Senão o sistema quebra.
        if (Objects.requireNonNull(usuarioDB).getConta().getUsername() != null && Objects.requireNonNull(usuarioDB).getConta().getUsername().equals(this.tenantIdentifierResolver.getUsername())) {
            // Cria o contexto de segurança
            final SecurityContext context = createSecurityContextByUserDetails(usuario.getConta());
            exchange.getSession().subscribe(webSession -> webSession.getAttributes().put(DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME, context));
//            Objects.requireNonNull(exchange.getSession().block()).getAttributes().put(DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME, context);
        }

        return usuario;
    }

    /**
     * @param usuario Usuario
     * @return Usuario
     */
    public Usuario save(final Usuario usuario) {

        if (usuario.getConta() == null)
            usuario.setConta(new Conta());

        // Encoda o password
        if (usuario.getConta().getEmail() != null && usuario.getConta().getEmail().length() > 0) {
            Assert.notNull(usuario.getConta().getPassword(), "Informe a senha");
            usuario.getConta().setPassword(passwordEncoder.encode(usuario.getConta().getPassword()));
        } else if (usuario.getConta().getEmail() != null && usuario.getConta().getEmail().length() == 0)
            usuario.getConta().setEmail(null);

        usuario.getConta().setEsquema(tenantIdentifierResolver.resolveCurrentTenantIdentifier());

        usuario.getConta().setRoot(tenantIdentifierResolver.resolveCurrentTenantIdentifier().equals(DEFAULT_TENANT_ID));

        return usuarioRepository.save(usuario);
    }

    /**
     * Método público que cria a conta do usuário como administrador
     *
     * @param usuario  Usuario
     * @param exchange ServerWebExchange
     * @return Mono<Usuario>
     */
    public Usuario createAccount(final ServerWebExchange exchange, final Usuario usuario) {

        // Verifica se não é um robô
        Assert.isTrue(this.recaptchaService.checkRecaptcha(usuario.getRecap()), "Você é um robô?");

        // Verifica se a conta já existe
        if (this.contaRepository.findByEmailIgnoreCase(usuario.getConta().getEmail()) != null)
            throw new RuntimeException("Conta com e-mail " + usuario.getConta().getEmail() + " já cadastrada");

        // Encoda a senha da conta
        usuario.getConta().setPassword(passwordEncoder.encode(usuario.getConta().getPassword()));

        // Seta a conta do usuário como administrador
        usuario.getConta().setAdministrador(true);

        // Seta a conta do usuário como "não root", só  pode gerenciara empresa dele
        usuario.getConta().setRoot(false);

        // Seta o esquema
        usuario.getConta().setEsquema(usuario.getConta().getEmail());

        usuario.validateDocumento();

        // Cria o novo esquema
        flywaySchemaInitializer.migrate(usuario.getConta().getEsquema());

        // Cria o contexto de segurança
        final SecurityContext securityContext = createSecurityContextByUserDetails(usuario.getConta());

        // Insere o contexto no repositório de contexto e retorna o usuário inserido
        serverSecurityContextRepository.save(exchange, securityContext).subscribe();

        tenantIdentifierResolver.setSchema(usuario.getConta().getEsquema());

        usuarioRepository.save(usuario);

        // Insere os dados padrões para utilização inicial do sistema
        this.bootstrapTemplate();

        // E o usuário será salvo automáticamente no esquema públic
        return usuario;

    }

    /**
     * Dados padrão para utilização inicial do sistema
     */
    @Transactional
    public void bootstrapTemplate() {

        // Tipo de avaliação
        final TipoAvaliacao tipoAvaliacao = new TipoAvaliacao();
        tipoAvaliacao.setNome("Atendimento");
        tipoAvaliacao.setEnunciado("Como você avalia nosso atendimento?");
        tipoAvaliacao.setSelecao("Selecione um ou mais atendentes");
        this.tipoAvaliacaoService.save(tipoAvaliacao);

        // Unidade
        final Unidade unidade = new Unidade();
        unidade.setNome("Minha primeira unidade");
        this.unidadeService.save(unidade);

        // Vínculo entre unidade e tipo de avaliação
        final UnidadeTipoAvaliacao unidadeTipoAvaliacao = new UnidadeTipoAvaliacao();
        unidadeTipoAvaliacao.setAtivo(true);
        unidadeTipoAvaliacao.setTipoAvaliacao(tipoAvaliacao);
        unidadeTipoAvaliacao.setUnidade(unidade);
        this.unidadeTipoAvaliacaoService.save(unidadeTipoAvaliacao);

        final Dispositivo dispositivo = new Dispositivo();
//        dispositivo.setAssinatura(assinaturaRepository.findAll().get(0));
        dispositivo.setNome("Meu primeiro dispositivo");
        dispositivo.setQuebrarLinhaNaSelecaoDeItemAvaliavel(true);
        dispositivo.setTime((short) 30);
        dispositivo.setTenant(tenantIdentifierResolver.resolveCurrentTenantIdentifier());
        this.dispositivoRepository.save(dispositivo);

        final UnidadeTipoAvaliacaoDispositivo unidadeTipoAvaliacaoDispositivo = new UnidadeTipoAvaliacaoDispositivo();
        unidadeTipoAvaliacaoDispositivo.setOrdem((short) 1);
        unidadeTipoAvaliacaoDispositivo.setAtivo(true);
        unidadeTipoAvaliacaoDispositivo.setUnidadeTipoAvaliacao(unidadeTipoAvaliacao);
        unidadeTipoAvaliacaoDispositivo.setDispositivo(dispositivo);
        this.unidadeTipoAvaliacaoDispositivoRepository.save(unidadeTipoAvaliacaoDispositivo);

        // Quesito
        final Usuario quesito = new Usuario();
        quesito.setNome("Atendimento");
        this.save(quesito);

        // Vinculo entre a avaliação vinculada á unidade e o quesito
        final Avaliavel avaliavel = new Avaliavel();
        avaliavel.setUsuario(quesito);
        avaliavel.setUnidadeTipoAvaliacaoDispositivo(unidadeTipoAvaliacaoDispositivo);
        this.avaliavelService.save(avaliavel);

        final Configuracao configuracao = new Configuracao();
        try {
            final URL backgroundImageURL = getClass().getResource("../../../../../public/assets/images/banner-1920x720.png");
            if (backgroundImageURL != null)
                configuracao.setBackgroundImage(IOUtils.toByteArray(backgroundImageURL));
            final URL logoURL = getClass().getResource("../../../../../public/assets/images/logomarca-400x119.png");
            if (logoURL != null)
                configuracao.setLogo(IOUtils.toByteArray(logoURL));
        } catch (IOException e) {
            e.printStackTrace();
        }
        this.configuracaoRepository.save(configuracao);
    }

    /**
     * @param usuarioId long
     * @return Optional<Usuario>
     */
    public Optional<Usuario> findById(final long usuarioId) {
        return Optional.of(usuarioRepository.findUsuarioByIdAndReturnAvaliacoes(usuarioId));
    }

    /**
     * @param usuarioId long
     */
    @Transactional
    public void delete(final long usuarioId) {

        Assert.isTrue(!Objects.requireNonNull(this.usuarioRepository.findById(usuarioId).orElse(null)).getConta().isCliente(), "Entre em contato com os administradores para a exclusão de um cliente");

        // Deleta todos os operadores
        this.operadorService.delete(this.operadorService.findAllByUsuarioId(usuarioId));

        // Deleta todos os avaliáveis
        this.avaliavelService.delete(this.avaliavelService.findAllByUsuarioId(usuarioId));

        usuarioRepository.deleteById(usuarioId);

    }

    /**
     * @param defaultFilter String
     * @param pageable      Pageable
     * @return Page<Usuario>
     */
    @Transactional(readOnly = true)
    public Page<Usuario> listByFilters(final String defaultFilter, final List<Long> idsFilter, final Pageable pageable) {

        final Conta conta = contaRepository.findByEmailIgnoreCase(tenantIdentifierResolver.getUsername());

        final Long usuarioId = conta.isRoot() ? null : conta.getUsuario().getId();

        return usuarioRepository.listByFilters(usuarioId, conta.getPerfil().name(), defaultFilter, idsFilter, pageable);

    }

    /**
     * @param defaultFilter         String
     * @param unidadesFilter        List<Long>
     * @param tiposAvaliacoesFilter List<Long>
     * @param pageable              Pageable
     * @return Page<Usuario>
     */
    public Page<Usuario> listByFilters(final String defaultFilter,
                                       final List<Long> unidadesFilter,
                                       final List<Long> tiposAvaliacoesFilter,
                                       final LocalDateTime dataInicioFilter,
                                       final LocalDateTime dataTerminoFilter,
                                       final Pageable pageable) {

        final Conta conta = contaRepository.findByEmailIgnoreCase(tenantIdentifierResolver.getUsername());

        final Long usuarioId = conta.isRoot() ? null : conta.getUsuario().getId();

        final Page<Usuario> page = usuarioRepository.listByFilters(
                usuarioId,
                conta.getPerfil().name(),
                defaultFilter,
                tiposAvaliacoesFilter,
                unidadesFilter,
                dataInicioFilter,
                dataTerminoFilter,
                pageable);

        page.getContent().forEach(usuario -> usuario.setAvaliaveis(avaliavelService.findAllByUsuarioId(usuario.getId())));

        return page;
    }

    /**
     * @param usuarioId         Long
     * @param dataInicioFilter  LocalDateTime
     * @param dataTerminoFilter LocalDateTime
     * @return Optional<Usuario>
     */
    public Optional<Usuario> findUsuarioById(final Long usuarioId,
                                             final LocalDateTime dataInicioFilter,
                                             final LocalDateTime dataTerminoFilter) {

        return usuarioRepository.findUsuarioById(usuarioId, dataInicioFilter, dataTerminoFilter);

    }


    /**
     * @param id          long
     * @param fileInBytes byte[]
     * @return String
     */
    public String save(final long id, final byte[] fileInBytes) {
        final Usuario usuario = usuarioRepository.findById(id).orElse(null);

        try {

            final int width = ImageUtils.getBufferedImageFromByteArray(fileInBytes).getWidth();
            final int height = ImageUtils.getBufferedImageFromByteArray(fileInBytes).getHeight();

            final int thumbnailWidth = width - (int) Math.round((width * 0.75));
            final int thumbnailHeight = height - (int) Math.round((height * 0.75));

            Objects.requireNonNull(usuario).setThumbnail(ImageUtils.resizeImage(fileInBytes, thumbnailWidth, thumbnailHeight));

            final int avatarWidth = width - (int) Math.round((width * 0.25));
            final int avatarHeight = height - (int) Math.round((height * 0.25));

            usuario.setAvatar(ImageUtils.resizeImage(fileInBytes, avatarWidth, avatarHeight));

            usuario.setFoto(fileInBytes);

        } catch (IOException e) {

            e.printStackTrace();

        }

        return usuarioRepository.save(usuario).getFotoPath();
    }

    public String update(final long id, final byte[] fileInBytes) {
        return save(id, fileInBytes);
    }

    /**
     * @param id
     * @param tenant
     * @return
     */
    public byte[] findThumbnail(final long id, final String tenant) {
        tenantIdentifierResolver.setSchema(tenant);
        return findThumbnail(id);
    }

    /**
     * @param id
     * @return
     */
    @Transactional(readOnly = true)
    public byte[] findThumbnail(final long id) {
        return Objects.requireNonNull(usuarioRepository.findById(id).orElse(null)).getThumbnail();
    }

    /**
     * @param id
     * @param tenant
     * @return
     */
    public byte[] findAvatar(final long id, final String tenant) {
        tenantIdentifierResolver.setSchema(tenant);
        return findAvatar(id);
    }

    /**
     * @param id
     * @return
     */
    @Transactional(readOnly = true)
    public byte[] findAvatar(final long id) {
        return Objects.requireNonNull(usuarioRepository.findById(id).orElse(null)).getAvatar();
    }

    /**
     * @param id
     * @param tenant
     * @return
     */
    public byte[] findFoto(final long id, final String tenant) {
        tenantIdentifierResolver.setSchema(tenant);
        return findFoto(id);
    }

    /**
     * @param id
     * @return
     */
    @Transactional(readOnly = true)
    public byte[] findFoto(final long id) {
        return Objects.requireNonNull(usuarioRepository.findById(id).orElse(null)).getFoto();
    }

    /**
     * Deleta a foto do usuaŕio
     *
     * @param id {long}
     */
    public void deleteFoto(long id) {
        final Usuario usuario = usuarioRepository.findById(id).orElse(null);
        Objects.requireNonNull(usuario).setFoto(null);
        usuario.setAvatar(null);
        usuario.setThumbnail(null);
        usuarioRepository.save(usuario);
    }

    /**
     * @return
     */
    public String getSiteKey() {
        return this.recaptchaService.getSiteKey();
    }
}
