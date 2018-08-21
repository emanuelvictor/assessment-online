package br.com.assessment.domain.service;

import br.com.assessment.application.context.Context;
import br.com.assessment.application.multitenancy.TenantIdentifierResolver;
import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.repository.UsuarioRepository;
import br.com.assessment.infrastructure.file.ImageUtils;
import lombok.AllArgsConstructor;
import org.flywaydb.core.Flyway;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.Part;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;


@Service
@AllArgsConstructor
public class UsuarioService {

    private final Flyway flyway;

    private final PasswordEncoder passwordEncoder;

    private final UsuarioRepository usuarioRepository;

    private final TenantIdentifierResolver tenantIdentifierResolver;

    private final ServerSecurityContextRepository serverSecurityContextRepository;

    public Mono<Optional<Usuario>> findUsuarioById(final long usuarioId) {
        return Mono.just(this.usuarioRepository.findById(usuarioId));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Mono<Usuario> save(final Usuario usuario) {

        // Encoda o password
        if (usuario.getConta().getEmail() != null && usuario.getConta().getEmail().length() > 0) {
            Assert.notNull(usuario.getConta().getPassword(), "Informe a senha");
            usuario.getConta().setPassword(this.passwordEncoder.encode(usuario.getConta().getPassword()));
        }

        usuario.getConta().setEsquema(this.tenantIdentifierResolver.resolveCurrentTenantIdentifier());// TODO verificar se não da pra usar o context
        usuario.getConta().setUsuario(usuario);

        return Mono.just(this.usuarioRepository.save(usuario));
    }

    /**
     * Método público que cria a conta do usuário como administrador
     *
     * @param usuario Usuario
     * @return Mono<Usuario>
     */
    public Mono<Usuario> createAccount(ServerWebExchange exchange, final Usuario usuario) {

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
        return Mono.just(this.usuarioRepository.save(usuario));

    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Mono<Boolean> delete(final long usuarioId) {
        this.usuarioRepository.deleteById(usuarioId);
        return Mono.just(true);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Flux<Usuario> findAll() {

        final List<Usuario> list = this.usuarioRepository.findAll();

        return Flux.just(list.toArray(new Usuario[list.size()]));
    }

//    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Mono<Page<Usuario>> listByFilters(final String filters, final Pageable pageable) {

        final Page<Usuario> page = this.usuarioRepository.listByFilters(filters, pageable);

        return Mono.just(page);



//        return Flux.just(list.toArray(new Usuario[list.size()]));
    }


    /**
     * Salva a foto, também é utilizado pra atualizar foto
     *
     * @param id   long
     * @param file Flux<Part>
     * @return Flux<String>
     */
    public Flux<String> save(final long id, final Flux<Part> file) {
        return file
                .filter(part -> part instanceof FilePart) // only retain file parts
                .ofType(FilePart.class)
                .flatMap(ImageUtils::getBytes)
                .map((byte[] bytes) -> {
                    final Usuario usuario = this.usuarioRepository.findById(id).get();

                    try {
                        final int width = ImageUtils.getBufferedImageFromByteArray(bytes).getWidth();
                        final int height = ImageUtils.getBufferedImageFromByteArray(bytes).getHeight();

                        final int thumbnailWidth = width - (int) Math.round((width * 0.75));
                        final int thumbnailHeight = height - (int) Math.round((height * 0.75));

                        usuario.setThumbnail(ImageUtils.resizeImage(bytes, thumbnailWidth, thumbnailHeight));

                        final int avatarWidth = width - (int) Math.round((width * 0.25));
                        final int avatarHeight = height - (int) Math.round((height * 0.25));

                        usuario.setAvatar(ImageUtils.resizeImage(bytes, avatarWidth, avatarHeight));

                        usuario.setFoto(bytes);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }

                    return this.usuarioRepository.save(usuario).getFotoPath();
                });
    }

    public Flux<String> update(final long id, final Flux<Part> file) {
        return this.save(id, file);
    }

    /**
     * TODO jogar pra cima
     *
     * @param id long
     * @return Mono<ResponseEntity<byte[]>>
     */
    public Mono<ResponseEntity<byte[]>> findThumbnail(final long id) {
        return Mono.just(
                ResponseEntity.ok().cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
                        .body(this.usuarioRepository.findById(id).get().getThumbnail()));
    }

    public Mono<ResponseEntity<byte[]>> findAvatar(final long id) {
        return Mono.just(
                ResponseEntity.ok().cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
                        .body(this.usuarioRepository.findById(id).get().getAvatar()));
    }


    public Mono<ResponseEntity<byte[]>> findFoto(final long id) {
        return Mono.just(
                ResponseEntity.ok().cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
                        .body(this.usuarioRepository.findById(id).get().getFoto()));
    }

    /**
     * Deleta a foto do usuaŕio
     *
     * @param id {long}
     * @return {Flux<Boolean>}
     */
    public Flux<Boolean> deleteFoto(long id) {
        final Usuario usuario = this.usuarioRepository.findById(id).get();
        usuario.setFoto(null);
        usuario.setAvatar(null);
        usuario.setThumbnail(null);
        this.usuarioRepository.save(usuario);
        return Flux.just(usuario.getFotoPath() == null);
    }

}