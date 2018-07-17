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
                .ofType(FilePart.class) // convert the flux to FilePart
                .flatMap(this::saveFile); // save each file and flatmap it to a flux of results


//        return Mono.create(monoSink -> {
//
//            file.subscribe(part -> {
//                part.content().subscribe(dataBuffer -> {
//
//                    final Usuario usuario = this.usuarioRepository.findById(id).get();
//
//                    usuario.setFoto(dataBuffer.asByteBuffer().array());
//
//                    this.usuarioRepository.save(usuario);
//
//                    monoSink.success("usuario" + Long.toString(id));
//                });
//            });
//
//        });
    }


    /**
     * tske a {@link FilePart}, transfer it to disk using {@link AsynchronousFileChannel}s and return a {@link Mono} representing the result
     *
     * @param filePart - the request part containing the file to be saved
     * @return a {@link Mono} representing the result of the operation
     */
    private Mono<String> saveFile(FilePart filePart) {
        LOGGER.info("handling file upload {}", filePart.filename());

        // if a file with the same name already exists in a repository, delete and recreate it
        final String filename = filePart.filename();
        File file = new File(filename);
        if (file.exists())
            file.delete();
        try {
            file.createNewFile();
        } catch (IOException e) {
            return Mono.error(e); // if creating a new file fails return an error
        }

        try {
            // create an async file channel to store the file on disk
            final AsynchronousFileChannel fileChannel = AsynchronousFileChannel.open(file.toPath(), StandardOpenOption.WRITE);

            final CloseCondition closeCondition = new CloseCondition();

            // pointer to the end of file offset
            AtomicInteger fileWriteOffset = new AtomicInteger(0);
            // error signal
            AtomicBoolean errorFlag = new AtomicBoolean(false);

            LOGGER.info("subscribing to file parts");
            // FilePart.content produces a flux of data buffers, each need to be written to the file
            return filePart.content().doOnEach(dataBufferSignal -> {
                if (dataBufferSignal.hasValue() && !errorFlag.get()) {
                    // read data from the incoming data buffer into a file array
                    DataBuffer dataBuffer = dataBufferSignal.get();
                    int count = dataBuffer.readableByteCount();
                    byte[] bytes = new byte[count];
                    dataBuffer.read(bytes);

                    // create a file channel compatible byte buffer
                    final ByteBuffer byteBuffer = ByteBuffer.allocate(count);
                    byteBuffer.put(bytes);
                    byteBuffer.flip();

                    // get the current write offset and increment by the buffer size
                    final int filePartOffset = fileWriteOffset.getAndAdd(count);
                    LOGGER.info("processing file part at offset {}", filePartOffset);
                    // write the buffer to disk
                    closeCondition.onTaskSubmitted();
                    fileChannel.write(byteBuffer, filePartOffset, null, new CompletionHandler<Integer, ByteBuffer>() {
                        @Override
                        public void completed(Integer result, ByteBuffer attachment) {
                            // file part successfuly written to disk, clean up
                            LOGGER.info("done saving file part {}", filePartOffset);
                            byteBuffer.clear();

                            if (closeCondition.onTaskCompleted())
                                try {
                                    LOGGER.info("closing after last part");
                                    fileChannel.close();
                                } catch (IOException ignored) {
                                    ignored.printStackTrace();
                                }
                        }

                        @Override
                        public void failed(Throwable exc, ByteBuffer attachment) {
                            // there as an error while writing to disk, set an error flag
                            errorFlag.set(true);
                            LOGGER.info("error saving file part {}", filePartOffset);
                        }
                    });
                }
            }).doOnComplete(() -> {
                // all done, close the file channel
                LOGGER.info("done processing file parts");
                if (closeCondition.canCloseOnComplete())
                    try {
                        LOGGER.info("closing after complete");
                        fileChannel.close();
                    } catch (IOException ignored) {
                    }

            }).doOnError(t -> {
                // ooops there was an error
                LOGGER.info("error processing file parts");
                try {
                    fileChannel.close();
                } catch (IOException ignored) {
                }
                // take last, map to a status string
            }).last().map(dataBuffer -> filePart.filename() + " " + (errorFlag.get() ? "error" : "uploaded"));
        } catch (IOException e) {
            // unable to open the file channel, return an error
            LOGGER.info("error opening the file channel");
            return Mono.error(e);
        }
    }


    class CloseCondition {
        Logger LOGGER = LoggerFactory.getLogger(CloseCondition.class);

        AtomicInteger tasksSubmitted = new AtomicInteger(0);
        AtomicInteger tasksCompleted = new AtomicInteger(0);
        AtomicBoolean allTaskssubmitted = new AtomicBoolean(false);

        /**
         * notify all tasks have been subitted, determine of the file channel can be closed
         * @return true if the asynchronous file stream can be closed
         */
        public boolean canCloseOnComplete() {
            allTaskssubmitted.set(true);
            return tasksCompleted.get() == tasksSubmitted.get();
        }

        /**
         * notify a task has been submitted
         */
        public void onTaskSubmitted() {
            tasksSubmitted.incrementAndGet();
        }

        /**
         * notify a task has been completed
         * @return true if the asynchronous file stream can be closed
         */
        public boolean onTaskCompleted() {
            boolean allSubmittedClosed = tasksSubmitted.get() == tasksCompleted.incrementAndGet();
            return allSubmittedClosed && allTaskssubmitted.get();
        }
    }

    /**
     * @param id
     * @param file
     * @return
     */
    public Mono<byte[]> update(long id, Flux<Part> file) {
        System.out.println(id);
        return null;
    }

    public Mono<ResponseEntity<byte[]>> findFoto(final long id) {
        return Mono.just(
                ResponseEntity.ok().cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
                        .body(this.usuarioRepository.findById(id).get().getFoto()));


    }
}