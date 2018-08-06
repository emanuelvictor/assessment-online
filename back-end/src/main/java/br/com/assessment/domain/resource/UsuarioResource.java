package br.com.assessment.domain.resource;

import br.com.assessment.domain.service.UsuarioService;
import br.com.assessment.domain.entity.usuario.Usuario;
import javassist.bytecode.ByteArray;
import lombok.AllArgsConstructor;
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
@AllArgsConstructor
public class UsuarioResource {

    private final UsuarioService usuarioService;

    @PostMapping
    public Mono<Usuario> save(@RequestBody final Usuario usuario) {
        return this.usuarioService.save(usuario);
    }

    @PutMapping
    public Mono<Usuario> update(@RequestBody final Usuario usuario) {
        return this.usuarioService.save(usuario);
    }

    @DeleteMapping("{id}")
    public Mono<Boolean> delete(@PathVariable final long id) {
        return this.usuarioService.delete(id);
    }

    @GetMapping("{id}")
    public Mono<Optional<Usuario>> findUsuarioById(@PathVariable final long id) {
        return this.usuarioService.findUsuarioById(id);
    }

    @GetMapping
    public Flux<Usuario> findAll() {
        return this.usuarioService.findAll();
    }


    @GetMapping(value = "{id}/thumbnail", produces = {MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE})
    public Mono<ResponseEntity<byte[]>> findThumbnail(@PathVariable final long id) {
        return this.usuarioService.findThumbnail(id);
    }

    @GetMapping(value = "{id}/avatar", produces = {MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE})
    public Mono<ResponseEntity<byte[]>> findAvatar(@PathVariable final long id) {
        return this.usuarioService.findAvatar(id);
    }

    @GetMapping(value = "{id}/foto", produces = {MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE})
    public Mono<ResponseEntity<byte[]>> findFoto(@PathVariable final long id) {
        return this.usuarioService.findFoto(id);
    }

    @PostMapping(value = "{id}/foto", produces = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Flux<String> save(@PathVariable final long id, @RequestPart("file") Flux<Part> file) {
        return this.usuarioService.save(id, file);

    }

    @PutMapping("{id}/foto")
    public Flux<String> update(@PathVariable final long id, @RequestPart("file") Flux<Part> file) {
        return this.usuarioService.update(id, file);
    }

    @DeleteMapping("{id}/foto")
    public Flux<Boolean> deleteFoto(@PathVariable final long id) {
        return this.usuarioService.deleteFoto(id);
    }

}