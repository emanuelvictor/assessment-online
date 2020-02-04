package online.meavalia.application.resource;

import lombok.RequiredArgsConstructor;
import online.meavalia.domain.entity.usuario.Perfil;
import online.meavalia.domain.entity.usuario.Usuario;
import online.meavalia.domain.repository.UsuarioRepository;
import online.meavalia.domain.UsuarioService;
import online.meavalia.infrastructure.file.ImageUtils;
import online.meavalia.infrastructure.resource.AbstractResource;
import online.meavalia.infrastructure.suport.Utils;
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

@RestController
@RequiredArgsConstructor
@RequestMapping({"**usuarios", "**public/usuarios", "**sistema/usuarios", "**sistema/mobile/usuarios"})
public class UsuarioResource extends AbstractResource<Usuario> {

    /**
     *
     */
    private final UsuarioService usuarioService;

    /**
     *
     */
    private final UsuarioRepository usuarioRepository;

    /**
     * @return String
     */
    @GetMapping("sitekey")
    public String getSiteKey() {
        return this.usuarioService.getSiteKey();
    }

    /**
     * @param usuario
     * @return
     */
    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Usuario> save(@RequestBody final Usuario usuario) {
        return Mono.just(this.usuarioService.save(usuario));
    }

    /**
     * @param exchange
     * @param id
     * @param usuario
     * @return
     */
    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    public Mono<Usuario> update(final ServerWebExchange exchange, @PathVariable final long id, @RequestBody final Usuario usuario) {
        return Mono.just(this.usuarioService.save(exchange, id, usuario));
    }

    /**
     * @param id
     * @return
     */
    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Boolean> delete(@PathVariable final long id) {
        this.usuarioService.delete(id);
        return Mono.just(true);
    }

    /**
     * @param id
     * @return
     */
    @GetMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    public Mono<Optional<Usuario>> findUsuarioById(@PathVariable final long id) {
        return Mono.just(this.usuarioService.findById(id));
    }

    /**
     * @param id
     * @param dataInicioFilter
     * @param dataTerminoFilter
     * @return
     */
    @GetMapping("{id}/estatisticas")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<Optional<Usuario>> findUsuarioById(@PathVariable final long id,
                                            @RequestParam(required = false) final LocalDateTime dataInicioFilter,
                                            @RequestParam(required = false) final LocalDateTime dataTerminoFilter) {
        return Mono.just(usuarioService.findUsuarioById(id, dataInicioFilter, dataTerminoFilter));
    }

    /**
     * @param defaultFilter
     * @param unidadesFilter
     * @param tiposAvaliacoesFilter
     * @param dataInicioFilter
     * @param dataTerminoFilter
     * @return
     */
    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    Mono<Page<Usuario>> listByFilters(final String defaultFilter, final Long[] unidadesFilter, final Long[] tiposAvaliacoesFilter,
                                      @RequestParam(required = false) final LocalDateTime dataInicioFilter,
                                      @RequestParam(required = false) final LocalDateTime dataTerminoFilter) {
        return Mono.just(usuarioService.listByFilters(defaultFilter, Utils.getListFromArray(unidadesFilter), Utils.getListFromArray(tiposAvaliacoesFilter), dataInicioFilter, dataTerminoFilter, getPageable()));
    }

    /**
     * @param defaultFilter
     * @param idsFilter
     * @return
     */
    @GetMapping("light")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    Mono<Page<Usuario>> listLightByFilters(final String defaultFilter, final Long[] idsFilter) {
        return Mono.just(this.usuarioService.listByFilters(defaultFilter, Utils.getListFromArray(idsFilter), getPageable()));
    }

    /**
     * @param id
     * @param tenant
     * @return
     */
    @GetMapping(value = "{id}/thumbnail/{avatar}", produces = {MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE})
    public Mono<ResponseEntity<byte[]>> findThumbnail(@PathVariable final long id, final @PathVariable String tenant) {

        return Mono.just(
                ResponseEntity.ok().cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
                        .body(this.usuarioService.findThumbnail(id, tenant))
        );
    }

    /**
     * @param id
     * @return
     */
    @GetMapping(value = "{id}/thumbnail", produces = {MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE})
    public Mono<ResponseEntity<byte[]>> findThumbnail(@PathVariable final long id) {

        return Mono.just(
                ResponseEntity.ok().cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
                        .body(this.usuarioService.findThumbnail(id))
        );
    }

    /**
     * @param id
     * @param tenant
     * @return
     */
    @GetMapping(value = "{id}/avatar/{tenant}", produces = {MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE})
    public Mono<ResponseEntity<byte[]>> findAvatar(@PathVariable final long id, final @PathVariable String tenant) {
        return Mono.just(
                ResponseEntity.ok().cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
                        .body(this.usuarioService.findAvatar(id, tenant))
        );
    }

    /**
     * @param id
     * @return
     */
    @GetMapping(value = "{id}/avatar", produces = {MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE})
    public Mono<ResponseEntity<byte[]>> findAvatar(@PathVariable final long id) {
        return Mono.just(
                ResponseEntity.ok().cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
                        .body(this.usuarioService.findAvatar(id))
        );
    }

    /**
     * @param id
     * @param tenant
     * @return
     */
    @GetMapping(value = "{id}/foto/{tenant}", produces = {MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE})
    public Mono<ResponseEntity<byte[]>> findFoto(@PathVariable final long id, final @PathVariable String tenant) {
        return Mono.just(
                ResponseEntity.ok().cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
                        .body(this.usuarioService.findFoto(id, tenant))
        );
    }

    /**
     * @param id
     * @return
     */
    @GetMapping(value = "{id}/foto", produces = {MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE})
    public Mono<ResponseEntity<byte[]>> findFoto(@PathVariable final long id) {
        return Mono.just(
                ResponseEntity.ok().cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
                        .body(this.usuarioService.findFoto(id))
        );
    }

    /**
     * @param id
     * @param file
     * @return
     */
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    @PostMapping(value = "{id}/foto", produces = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Flux<String> save(@PathVariable final long id, @RequestPart("file") Flux<Part> file) {

        return file
                .filter(part -> part instanceof FilePart) // only retain file parts
                .ofType(FilePart.class)
                .flatMap(ImageUtils::getBytes)
                .map((byte[] bytes) -> this.usuarioService.save(id, bytes));

    }

    /**
     * @param id
     * @param file
     * @return
     */
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    @PutMapping("{id}/foto")
    public Flux<String> update(@PathVariable final long id, @RequestPart("file") Flux<Part> file) {
        return file
                .filter(part -> part instanceof FilePart) // only retain file parts
                .ofType(FilePart.class)
                .flatMap(ImageUtils::getBytes)
                .map((byte[] bytes) -> this.usuarioService.update(id, bytes));
    }

    /**
     * @param id
     * @return
     */
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    @DeleteMapping("{id}/foto")
    public Mono<Boolean> deleteFoto(@PathVariable final long id) {
        this.usuarioService.deleteFoto(id);
        return Mono.just(true);
    }

    /**
     * @param exchange
     * @param usuario
     * @return
     */
    @PostMapping(value = "/contas")
    public Mono<Usuario> createAccount(final ServerWebExchange exchange, @RequestBody final Usuario usuario) {
        return Mono.just(this.usuarioService.createAccount(exchange, usuario));
    }

    /**
     * @param usuarioId
     * @param password
     * @param newPassword
     * @return
     */
    @GetMapping("contas/{usuarioId}/change-password")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<Usuario> changePassword(@PathVariable final long usuarioId, @RequestParam(required = false) final String password, @RequestParam final String newPassword) {
        return Mono.just(this.usuarioService.changePassword(usuarioId, password, newPassword));
    }

    /**
     * Retorna o password criptografado do usuário, para armazenamento offline
     *
     * @param usuarioId Long
     * @return String
     */
    @GetMapping("contas/{usuarioId}/senha")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<String> getSenhaByUsuarioId(@PathVariable final long usuarioId) {
        return Mono.just(this.usuarioRepository.findById(usuarioId).orElseGet(Usuario::new).getConta().getPassword());
    }
}
