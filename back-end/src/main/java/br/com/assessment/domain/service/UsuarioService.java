package br.com.assessment.domain.service;

import br.com.assessment.application.multitenancy.TenantIdentifierResolver;
import br.com.assessment.domain.entity.usuario.Conta;
import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.repository.ContaRepository;
import br.com.assessment.domain.repository.UsuarioRepository;
import br.com.assessment.infrastructure.file.ImageUtils;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.Part;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static br.com.assessment.application.multitenancy.TenantIdentifierResolver.DEFAULT_TENANT_ID;

@Service
@Transactional
@AllArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    private final PasswordEncoder passwordEncoder;

    private final TenantIdentifierResolver tenantIdentifierResolver;

    private final ContaRepository contaRepository;

    private final DataSource dataSource;
    /**
     * @param usuarioId
     * @return
     */
    public Mono<Optional<Usuario>> findUsuarioById(final long usuarioId) {
        return Mono.just(this.usuarioRepository.findById(usuarioId));
    }


    /**
     *
     */
//    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Mono<Usuario> save(final Usuario usuario) {
        // Encoda o password
        if (usuario.getConta() != null){
            usuario.getConta().setPassword(this.passwordEncoder.encode(usuario.getConta().getPassword()));
            final Conta conta = new Conta(this.tenantIdentifierResolver.resolveCurrentTenantIdentifier());
            this.contaRepository.save(conta);

            usuario.setConta(conta);
        }
        return  Mono.just(this.usuarioRepository.save(usuario));
    }

    /**
     * Método público que cria a conta do usuário como administrador
     *
     * @param usuario Usuario
     * @return Mono<Usuario>
     */
    public Mono<Usuario> createAccount(final Usuario usuario) {

        // Encoda a senha do usuário
        usuario.getConta().setPassword(this.passwordEncoder.encode(usuario.getConta().getPassword()));

        // Seta o esquema
        usuario.getConta().setEsquema(usuario.getConta().getEmail());

        // Seta a conta do usuário como administrador
        usuario.getConta().setAdministrador(true);

        // Seta a conta do usuário como "não root", só  pode gerenciara empresa dele
        usuario.getConta().setRoot(false);

        return Mono.just(this.usuarioRepository.save(usuario));
    }

    /**
     *
     * @param usuarioId
     */
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Mono<Boolean> delete(final long usuarioId) {
        this.usuarioRepository.deleteById(usuarioId);
        return Mono.just(true);
    }

    /**
     * @return
     */
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Flux<Usuario> findAll() {

        final List<Usuario> list = this.usuarioRepository.findAll();

        return Flux.just(list.toArray(new Usuario[list.size()]));
    }


    /**
     * Salva a foto, também é utilizado pra atualizar foto
     *
     * @param id
     * @param file
     * @return
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

    /**
     * @param id
     * @param file
     * @return
     */
    public Flux<String> update(final long id, final Flux<Part> file) {
        return this.save(id, file);
    }

    /**
     * TODO jogar pra cima
     * @param id
     * @return
     */
    public Mono<ResponseEntity<byte[]>> findThumbnail(final long id) {
        return Mono.just(
                ResponseEntity.ok().cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
                        .body(this.usuarioRepository.findById(id).get().getThumbnail()));
    }

    /**
     * @param id
     * @return
     */
    public Mono<ResponseEntity<byte[]>> findAvatar(final long id) {
        return Mono.just(
                ResponseEntity.ok().cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
                        .body(this.usuarioRepository.findById(id).get().getAvatar()));
    }


    /**
     * @param id
     * @return
     */
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