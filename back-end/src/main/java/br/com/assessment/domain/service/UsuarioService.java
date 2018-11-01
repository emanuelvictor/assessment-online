package br.com.assessment.domain.service;

import br.com.assessment.application.context.Context;
import br.com.assessment.application.multitenancy.TenantIdentifierResolver;
import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.repository.ContaRepository;
import br.com.assessment.domain.repository.UsuarioRepository;
import br.com.assessment.infrastructure.file.ImageUtils;
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
import org.springframework.util.Assert;
import org.springframework.web.server.ServerWebExchange;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final Flyway flyway;

    private final PasswordEncoder passwordEncoder;

    private final UsuarioRepository usuarioRepository;

    private final ContaRepository contaRepository;

    private final TenantIdentifierResolver tenantIdentifierResolver;

    private final ServerSecurityContextRepository serverSecurityContextRepository;

    public Optional<Usuario> findUsuarioById(final long usuarioId) {
        return this.usuarioRepository.findById(usuarioId);
    }

    public Usuario save(final long id, final Usuario usuario) {

        Assert.isTrue(usuario.getId() != null && usuario.getId().equals(id), "Você não tem acesso á esse usuário");

        //Seta novamente o password anterior
        usuario.getConta().setPassword(this.usuarioRepository.findById(usuario.getId()).get().getConta().getPassword());

        return this.usuarioRepository.save(usuario);
    }

    public Usuario save(final Usuario usuario) {

        // Encoda o password
        if (usuario.getConta().getEmail() != null && usuario.getConta().getEmail().length() > 0) {
            Assert.notNull(usuario.getConta().getPassword(), "Informe a senha");
            usuario.getConta().setPassword(this.passwordEncoder.encode(usuario.getConta().getPassword()));
        }

        usuario.getConta().setEsquema(this.tenantIdentifierResolver.resolveCurrentTenantIdentifier());// TODO verificar se não da pra usar o context
//        usuario.getConta().setUsuario(usuario);

        return this.usuarioRepository.save(usuario);
    }

    /**
     * Método público que cria a conta do usuário como administrador
     *
     * @param usuario Usuario
     * @return Mono<Usuario>
     */
    public Usuario createAccount(ServerWebExchange exchange, final Usuario usuario) {

        // Encoda a senha da conta
        usuario.getConta().setPassword(this.passwordEncoder.encode(usuario.getConta().getPassword()));

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

        // Insere o contexto no repositório de contexto e retorna o usuário inserido //TODO teve que ser feito o block
        serverSecurityContextRepository.save(exchange, securityContext).block();

        // Seto o squema default, isso fará o sistema setar o esquema da conta a se criar.
        Context.setCurrentSchema(usuario.getConta().getEsquema());

        // E o usuário será salvo automáticamente no esquema públic
        return this.usuarioRepository.save(usuario);

    }

    public void delete(final long usuarioId) {
        this.usuarioRepository.deleteById(usuarioId);
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

        final Usuario usuario = this.contaRepository.findByEmailIgnoreCase(Context.getCurrentUsername()).getUsuario();

        return this.usuarioRepository.listByFilters(
                usuario.getId(),
                usuario.getConta().getPerfil().name(),
                defaultFilter,
                unidadesFilter,
                dataInicioFilter,
                dataTerminoFilter,
                pageable);
    }


//    public Page<Usuario> listByFiltersAndRankeaveisIds(final List<Long> rankeaveisIds,
//                                       final String defaultFilter,
//                                       final List<Long> unidadesFilter,
//                                       final LocalDateTime dataInicioFilter,
//                                       final LocalDateTime dataTerminoFilter,
//                                       final Pageable pageable) {
//
//        final Usuario usuario = this.contaRepository.findByEmailIgnoreCase(Context.getCurrentUsername()).getUsuario();
//
//        return this.usuarioRepository.listByFiltersAndRankeaveisIds(rankeaveisIds,
//                usuario.getId(),
//                usuario.getConta().getPerfil().name(),
//                defaultFilter,
//                unidadesFilter,
//                dataInicioFilter,
//                dataTerminoFilter,
//                pageable);
//    }


    /**
     * @param id          long
     * @param fileInBytes byte[]
     * @return String
     */
    public String save(final long id, final byte[] fileInBytes) {
        final Usuario usuario = this.usuarioRepository.findById(id).orElseGet(null);

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
        return this.usuarioRepository.save(usuario).getFotoPath();
    }

    public String update(final long id, final byte[] fileInBytes) {
        return this.save(id, fileInBytes);
    }

    public byte[] findThumbnail(final long id) {
        return this.usuarioRepository.findById(id).orElseGet(null).getThumbnail();
    }

    public byte[] findAvatar(final long id) {
        return this.usuarioRepository.findById(id).orElseGet(null).getAvatar();
    }

    public byte[] findFoto(final long id) {
        return this.usuarioRepository.findById(id).orElseGet(null).getFoto();
    }

    /**
     * Deleta a foto do usuaŕio
     *
     * @param id {long}
     */
    public void deleteFoto(long id) {
        final Usuario usuario = this.usuarioRepository.findById(id).orElseGet(null);
        usuario.setFoto(null);
        usuario.setAvatar(null);
        usuario.setThumbnail(null);
        this.usuarioRepository.save(usuario);
    }

}