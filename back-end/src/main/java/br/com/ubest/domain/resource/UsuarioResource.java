package br.com.ubest.domain.resource;

import br.com.ubest.domain.entity.usuario.Perfil;
import br.com.ubest.domain.entity.usuario.Usuario;
import br.com.ubest.domain.service.UsuarioService;
import br.com.ubest.infrastructure.file.ImageUtils;
import br.com.ubest.infrastructure.resource.AbstractResource;
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

import static br.com.ubest.infrastructure.util.Utils.getListFromArray;

@RestController
@RequiredArgsConstructor
@RequestMapping({"**usuarios", "**sistema/usuarios", "**sistema/mobile/usuarios"})
public class UsuarioResource extends AbstractResource<Usuario> {

    private final UsuarioService usuarioService;

    /**
     * @return String
     */
    @GetMapping("sitekey")
    public String getSiteKey() {
        return this.usuarioService.getSiteKey();
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Usuario> save(@RequestBody final Usuario usuario) {
        return Mono.just(this.usuarioService.save(usuario));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    public Mono<Usuario> update(final ServerWebExchange exchange, @PathVariable final long id, @RequestBody final Usuario usuario) {
        return Mono.just(this.usuarioService.save(exchange, id, usuario));
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
        return Mono.just(this.usuarioService.findById(id));
    }

    @GetMapping("{id}/estatisticas")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<Optional<Usuario>> findUsuarioById(@PathVariable final long id,
                                            @RequestParam(required = false) final LocalDateTime dataInicioFilter,
                                            @RequestParam(required = false) final LocalDateTime dataTerminoFilter) {
        return Mono.just(usuarioService.findUsuarioById(id, dataInicioFilter, dataTerminoFilter));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    Mono<Page<Usuario>> listByFilters(final String defaultFilter, final Long[] unidadesFilter, final Long[] tiposAvaliacoesFilter,
                                      @RequestParam(required = false) final LocalDateTime dataInicioFilter,
                                      @RequestParam(required = false) final LocalDateTime dataTerminoFilter) {
        return Mono.just(usuarioService.listByFilters(defaultFilter, getListFromArray(unidadesFilter), getListFromArray(tiposAvaliacoesFilter), dataInicioFilter, dataTerminoFilter, getPageable()));
    }


    @GetMapping("light")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    Mono<Page<Usuario>> listByFilters(final String defaultFilter) {
        return Mono.just(usuarioService.listByFilters(defaultFilter, getPageable()));
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

    @GetMapping("contas/{usuarioId}/change-password")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<Usuario> changePassword(@PathVariable final long usuarioId, @RequestParam(required = false) final String password, @RequestParam final String newPassword) {
        return Mono.just(this.usuarioService.changePassword(usuarioId, password, newPassword));
    }

}
