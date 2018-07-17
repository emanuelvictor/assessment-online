package br.com.assessment.domain.resource;

import br.com.assessment.domain.service.UsuarioService;
import br.com.assessment.domain.entity.usuario.Usuario;
import javassist.bytecode.ByteArray;
import org.reactivestreams.Publisher;
import org.springframework.core.io.InputStreamResource;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.Part;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import javax.print.attribute.standard.Media;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
public class UsuarioResource {

    private final UsuarioService usuarioService;

    //Note Spring Boot 4.3+ autowires single constructors now
    public UsuarioResource(final UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public Mono<Usuario> save(@RequestBody final Usuario usuario) {
        return this.usuarioService.save(usuario);
    }

    @PutMapping
    public Mono<Usuario> update(@RequestBody final Usuario usuario) {
        return this.usuarioService.save(usuario);
    }

    @DeleteMapping("{id}")
    public boolean delete(@PathVariable final long id) {
        this.usuarioService.delete(id);
        return true;
    }

    @GetMapping("{id}")
    public Mono<Optional<Usuario>> findUsuarioById(@PathVariable final long id) {
        return this.usuarioService.findUsuarioById(id);
    }

    @GetMapping(params = "email")
    public Mono<UserDetails> findUsuarioByEmail(@RequestParam final String email) {
        return this.usuarioService.findUsuarioByEmail(email);
    }

    @GetMapping
    public Flux<Usuario> findAll() {
        return this.usuarioService.findAll();
    }

    @GetMapping("{id}/foto")
    public Mono<ResponseEntity<byte[]>> findFoto(@PathVariable final long id) {
        return this.usuarioService.findFoto(id);
    }

    @PostMapping(value = "{id}/foto", produces = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Flux<String> save(@PathVariable final long id, @RequestPart("file") Flux<Part> file) {
        return this.usuarioService.save(id, file);

    }

    @PutMapping("{id}/foto")
    public Mono<byte[]> update(@PathVariable final long id, @RequestPart("file") Flux<Part> file) {
        return this.usuarioService.update(id, file);
    }

    @DeleteMapping("{id}/foto")
    public void deleteFoto(@PathVariable final long id) {
    }

//    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    Mono<String> requestBodyFlux(@RequestPart("file") Flux<Part> file) {
//        LOGGER.info("Storing a new file. Recieved by Controller");
////        this.storageService.store(file);
//
//        file.subscribe(multipart -> {
//            System.out.println(multipart.name());
//        });
//
//        return partFluxDescription(file);
//    }
}