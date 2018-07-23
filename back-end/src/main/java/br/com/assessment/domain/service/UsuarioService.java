package br.com.assessment.domain.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.Part;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.File;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.AsynchronousFileChannel;
import java.nio.channels.CompletionHandler;
import java.nio.file.StandardOpenOption;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;


import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.repository.UsuarioRepository;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.Part;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import javax.activation.DataSource;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Transactional
public class UsuarioService {


    Logger LOGGER = LoggerFactory.getLogger(UsuarioService.class);


    private final UsuarioRepository usuarioRepository;

    private final PasswordEncoder passwordEncoder;

    public UsuarioService(final UsuarioRepository usuarioRepository, final PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     *
     */
    public Mono<UserDetails> findByUsername(final String email) {
        return this.findUsuarioByEmail(email);
    }

    /**
     * @param email
     * @return
     */
    public Mono<UserDetails> findUsuarioByEmail(final String email) {
        if (email.equals(Usuario.MASTER_USER_EMAIL)) {
            return Mono.just(Usuario.getMasterUser());
        }
        return Mono.just(usuarioRepository.findByEmail(email));
    }

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
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public Mono<Usuario> save(final Usuario usuario) {

        if (usuario.getPassword() != null)
            usuario.setPassword(this.passwordEncoder.encode(usuario.getPassword()));

        return Mono.just(this.usuarioRepository.save(usuario));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public void delete(final long usuarioId) {
        this.usuarioRepository.deleteById(usuarioId);
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
     * @param id
     * @param file
     * @return
     */
    public Flux<String> save(final long id, final Flux<Part> file) {
        return file
                .filter(part -> part instanceof FilePart) // only retain file parts
                .ofType(FilePart.class)
                .flatMap(this::getBytes)
                .map((byte[] bytes) -> {
                    final Usuario usuario = this.usuarioRepository.findById(id).get();
                    usuario.setFoto(bytes);
                    return this.usuarioRepository.save(usuario).getUrlFoto();
                });
    }

    /**
     * @param filePart
     * @return
     */
    private Mono<byte[]> getBytes(final FilePart filePart) {

        final ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        System.out.println(outputStream.size());
        return filePart.content().doOnEach(dataBufferSignal -> {

            if (dataBufferSignal.hasValue()) {

                final DataBuffer dataBuffer = dataBufferSignal.get();
                final int count = dataBuffer.readableByteCount();
                final byte[] bytes = new byte[count];
                dataBuffer.read(bytes);

                outputStream.write(bytes, 0, bytes.length);

            }

        }).doOnComplete(() -> System.out.println(outputStream.size())).last().map(dataBuffer ->
                outputStream.toByteArray()
        );

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
     * @param id
     * @return
     */
    public Mono<ResponseEntity<byte[]>> findFoto(final long id) {
        return Mono.just(
                ResponseEntity.ok().cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
                        .body(this.usuarioRepository.findById(id).get().getFoto()));
    }

    /**
     * @param id
     * @return
     */
    public Flux<Boolean> deleteFoto(long id) {
        final Usuario usuario = this.usuarioRepository.findById(id).get();
        usuario.setFoto(null);
        this.usuarioRepository.save(usuario);
        return Flux.just(usuario.getUrlFoto() == null);
    }
}