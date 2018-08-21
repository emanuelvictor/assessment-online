package br.com.assessment.domain.resource;

import br.com.assessment.application.context.Context;
import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import br.com.assessment.infrastructure.org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.Part;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/usuarios")
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
    Mono<Page<Usuario>> find(final String filters,
                             @RequestParam(name = "page", required = false, defaultValue = "0") int page,
                             @RequestParam(name = "size", required = false, defaultValue = "999999999") int size,
                             @RequestParam(name = "sort", required = false) String sort
    ) {
        return usuarioService.listByFilters(filters, Context.getPageable());
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


    @PostMapping(value = "/contas")
    public Mono<Usuario> createAccount(final ServerWebExchange exchange, @RequestBody final Usuario usuario){
        return this.usuarioService.createAccount(exchange, usuario);
    }

}