package br.com.assessment.domain.resource;

import br.com.assessment.domain.entity.usuario.Perfil;
import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.service.UsuarioService;
import br.com.assessment.infrastructure.file.ImageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.Part;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static br.com.assessment.application.context.Context.getPageable;
import static br.com.assessment.infrastructure.util.ArrayUtil.getListFromArray;

@RestController
@RequiredArgsConstructor
@RequestMapping({"**usuarios", "**sistema/usuarios", "**sistema/mobile/usuarios"})
public class UsuarioResource {

    private final UsuarioService usuarioService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Usuario> save(@RequestBody final Usuario usuario) {
        return Mono.just(this.usuarioService.save(usuario));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    public Mono<Usuario> update(@PathVariable final long id, @RequestBody final Usuario usuario) {
        return Mono.just(this.usuarioService.save(id, usuario));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Boolean> delete(@PathVariable final long id) {
        this.usuarioService.delete(id);
        return Mono.just(true);
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    public Mono<Optional<Usuario>> findUsuarioById(@PathVariable final long id) {
        return Mono.just(this.usuarioService.findUsuarioById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    Mono<Page<Usuario>> listByFilters(final String defaultFilter, final Long[] unidadesFilter,
                                      @RequestParam(required = false) final LocalDateTime dataInicioFilter,
                                      @RequestParam(required = false) final LocalDateTime dataTerminoFilter) {
        return Mono.just(usuarioService.listByFilters(defaultFilter, getListFromArray(unidadesFilter), dataInicioFilter, dataTerminoFilter, getPageable()));
    }

    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    @GetMapping(value = "{id}/thumbnail", produces = {MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE})
    public Mono<ResponseEntity<byte[]>> findThumbnail(@PathVariable final long id) {
        return Mono.just(
                ResponseEntity.ok().cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
                        .body(this.usuarioService.findThumbnail(id))
        );
    }

    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    @GetMapping(value = "{id}/avatar", produces = {MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE})
    public Mono<ResponseEntity<byte[]>> findAvatar(@PathVariable final long id) {
        return Mono.just(
                ResponseEntity.ok().cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
                        .body(this.usuarioService.findAvatar(id))
        );
    }

    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    @GetMapping(value = "{id}/foto", produces = {MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE})
    public Mono<ResponseEntity<byte[]>> findFoto(@PathVariable final long id) {
        return Mono.just(
                ResponseEntity.ok().cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
                        .body(this.usuarioService.findFoto(id))
        );
    }

    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    @PostMapping(value = "{id}/foto", produces = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Flux<String> save(@PathVariable final long id, @RequestPart("file") Flux<Part> file) {

        return file
                .filter(part -> part instanceof FilePart) // only retain file parts
                .ofType(FilePart.class)
                .flatMap(ImageUtils::getBytes)
                .map((byte[] bytes) -> this.usuarioService.save(id, bytes));

    }

    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    @PutMapping("{id}/foto")
    public Flux<String> update(@PathVariable final long id, @RequestPart("file") Flux<Part> file) {
        return file
                .filter(part -> part instanceof FilePart) // only retain file parts
                .ofType(FilePart.class)
                .flatMap(ImageUtils::getBytes)
                .map((byte[] bytes) -> this.usuarioService.update(id, bytes));
    }

    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    @DeleteMapping("{id}/foto")
    public Mono<Boolean> deleteFoto(@PathVariable final long id) {
        this.usuarioService.deleteFoto(id);
        return Mono.just(true);
    }

    @PostMapping(value = "/contas")
    public Mono<Usuario> createAccount(final ServerWebExchange exchange, @RequestBody final Usuario usuario) {
        return Mono.just(this.usuarioService.createAccount(exchange, usuario));
    }

}