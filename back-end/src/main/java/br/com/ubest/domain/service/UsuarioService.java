package br.com.ubest.domain.service;

import br.com.ubest.application.aspect.exceptions.PasswordNotFound;
import br.com.ubest.application.multitenancy.TenantIdentifierResolver;
import br.com.ubest.domain.entity.avaliacao.TipoAvaliacao;
import br.com.ubest.domain.entity.avaliacao.UnidadeTipoAvaliacao;
import br.com.ubest.domain.entity.endereco.Endereco;
import br.com.ubest.domain.entity.unidade.Unidade;
import br.com.ubest.domain.entity.usuario.Conta;
import br.com.ubest.domain.entity.usuario.Usuario;
import br.com.ubest.domain.entity.usuario.vinculo.Avaliavel;
import br.com.ubest.domain.repository.ContaRepository;
import br.com.ubest.domain.repository.UsuarioRepository;
import br.com.ubest.infrastructure.file.ImageUtils;
import lombok.RequiredArgsConstructor;
import org.flywaydb.core.Flyway;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.web.server.ServerWebExchange;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static br.com.ubest.Application.DEFAULT_TENANT_ID;


@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final Flyway flyway;

    private final UnidadeService unidadeService;

    private final ContaRepository contaRepository;

    private final PasswordEncoder passwordEncoder;

    private final OperadorService operadorService;

    private final EnderecoService enderecoService;

    private final AvaliavelService avaliavelService;

    private final UsuarioRepository usuarioRepository;

    private final TipoAvaliacaoService tipoAvaliacaoService;

    private final TenantIdentifierResolver tenantIdentifierResolver;

    private final UnidadeTipoAvaliacaoService unidadeTipoAvaliacaoService;

    private final ServerSecurityContextRepository serverSecurityContextRepository;

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
        if (loggedAccount.getUsuario().getId().equals(usuarioId)) {

            if (password != null && passwordEncoder.matches(password, loggedAccount.getPassword())) {
                loggedAccount.setPassword(passwordEncoder.encode(newPassword));
                contaRepository.save(loggedAccount);
                return usuarioRepository.findById(usuarioId).orElseGet(null);
            } else if (password == null) {
                loggedAccount.setPassword(passwordEncoder.encode(newPassword));
                contaRepository.save(loggedAccount);
                return usuarioRepository.findById(usuarioId).orElseGet(null);
            }


            throw new PasswordNotFound();

        }

        // Conta de um atendente, operador ou administrador meu
        else if (!loggedAccount.isAdministrador() && loggedAccount.getIsOperador()) {

            final List<Usuario> meusUsuarios = usuarioRepository.listByFilters(loggedAccount.getUsuario().getId(), loggedAccount.getPerfil().name(), null, null, null, null, null).getContent();

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

            final Usuario usuario = usuarioRepository.findById(usuarioId).orElseGet(null);
            final Conta conta = contaRepository.findById(usuario.getConta().getId()).orElseGet(null);
            conta.setPassword(passwordEncoder.encode(newPassword));
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
    public Usuario save(final long id, final Usuario usuario) {

        Assert.isTrue(usuario.getId() != null && usuario.getId().equals(id), "Você não tem acesso á esse usuário");

        final Usuario usuarioDB = usuarioRepository.findById(usuario.getId()).orElseGet(null);

        // Seta novamente o password anterior
//        usuario.getConta().setEsquema(tenantIdentifierResolver.resolveCurrentTenantIdentifier());//  TODO PQ TEM QUE SETAR DE NOVO????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????

        if (usuarioDB.getConta() != null && usuarioDB.getConta().getEmail() == null) {
            if (usuario.getConta().getPassword() != null)
                usuario.getConta().setPassword(passwordEncoder.encode(usuario.getConta().getPassword()));
        } else {
            usuario.getConta().setPassword(usuarioDB.getConta().getPassword());
        }

        // Reinsere a fotografia, as fotos devem ser atualizadas com seus respectivos services.
        usuario.setFoto(usuarioDB.getFoto());
        usuario.setThumbnail(usuarioDB.getThumbnail());
        usuario.setAvatar(usuarioDB.getAvatar());

        return usuarioRepository.save(usuario);
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
        }

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

        // Cria o novo esquema
        flyway.setSchemas(usuario.getConta().getEsquema());
        flyway.migrate();

        // Cria a autenticação
        final Authentication authentication = new UsernamePasswordAuthenticationToken(usuario.getConta(), usuario.getConta().getPassword(), usuario.getConta().getAuthorities());

        // Cria o contexto de segurança
        final SecurityContextImpl securityContext = new SecurityContextImpl(authentication);

        // Insere o contexto no repositório de contexto e retorna o usuário inserido
        serverSecurityContextRepository.save(exchange, securityContext).block();

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
        final Endereco endereo = new Endereco();
        endereo.setCidade(this.enderecoService.find("Foz do Iguaçu", "PR").get());
        final Unidade unidade = new Unidade();
        unidade.setNome("Minha primeira unidade");
        unidade.setEndereco(endereo);
        this.unidadeService.save(unidade);

        // Vínculo entre unidade e tipo de avaliação
        final UnidadeTipoAvaliacao unidadeTipoAvaliacao = new UnidadeTipoAvaliacao();
        unidadeTipoAvaliacao.setAtivo(true);
        unidadeTipoAvaliacao.setTipoAvaliacao(tipoAvaliacao);
        unidadeTipoAvaliacao.setUnidade(unidade);
        this.unidadeTipoAvaliacaoService.save(unidadeTipoAvaliacao);

        // Quesito
        final Usuario quesito = new Usuario();
        quesito.setNome("Atendimento");
        this.save(quesito);

        // Vinculo entre a avaliação vinculada á unidade e o quesito
        final Avaliavel avaliavel = new Avaliavel();
        avaliavel.setUsuario(quesito);
        avaliavel.setUnidadeTipoAvaliacao(unidadeTipoAvaliacao);
        this.avaliavelService.save(avaliavel);
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
    public Page<Usuario> listByFilters(final String defaultFilter, final Pageable pageable) {

        final Usuario usuario = contaRepository.findByEmailIgnoreCase(tenantIdentifierResolver.getUsername()).getUsuario();

        return usuarioRepository.listByFilters(usuario.getId(), usuario.getConta().getPerfil().name(), defaultFilter, pageable);

    }

    /**
     * @param defaultFilter  String
     * @param unidadesFilter List<Long>
     * @param pageable       Pageable
     * @return Page<Usuario>
     */
    public Page<Usuario> listByFilters(final String defaultFilter,
                                       final List<Long> unidadesFilter,
                                       final LocalDateTime dataInicioFilter,
                                       final LocalDateTime dataTerminoFilter,
                                       final Pageable pageable) {

        final Conta conta = contaRepository.findByEmailIgnoreCase(tenantIdentifierResolver.getUsername());


        final Long usuarioId = conta.isRoot() ? null : conta.getUsuario().getId();

        return usuarioRepository.listByFilters(
                usuarioId,
                conta.getPerfil().name(),
                defaultFilter,
                unidadesFilter,
                dataInicioFilter,
                dataTerminoFilter,
                pageable);

    }

    /**
     * @param usuarioId
     * @param dataInicioFilter
     * @param dataTerminoFilter
     * @return
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
        final Usuario usuario = usuarioRepository.findById(id).orElseGet(null);

        try {

            final int width = ImageUtils.getBufferedImageFromByteArray(fileInBytes).getWidth();
            final int height = ImageUtils.getBufferedImageFromByteArray(fileInBytes).getHeight();

            final int thumbnailWidth = width - (int) Math.round((width * 0.75));
            final int thumbnailHeight = height - (int) Math.round((height * 0.75));

            usuario.setThumbnail(ImageUtils.resizeImage(fileInBytes, thumbnailWidth, thumbnailHeight));

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

    public byte[] findThumbnail(final long id) {
        return usuarioRepository.findById(id).orElseGet(null).getThumbnail();
    }

    public byte[] findAvatar(final long id) {
        return usuarioRepository.findById(id).orElseGet(null).getAvatar();
    }

    public byte[] findFoto(final long id) {
        return usuarioRepository.findById(id).orElseGet(null).getFoto();
    }

    /**
     * Deleta a foto do usuaŕio
     *
     * @param id {long}
     */
    public void deleteFoto(long id) {
        final Usuario usuario = usuarioRepository.findById(id).orElseGet(null);
        usuario.setFoto(null);
        usuario.setAvatar(null);
        usuario.setThumbnail(null);
        usuarioRepository.save(usuario);
    }

    List<Usuario> findByNome(final String nome) {
        return usuarioRepository.findByNome(nome);
    }

}
