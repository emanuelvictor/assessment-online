package br.com.assessment.domain.resource;

import br.com.assessment.domain.entity.configuracao.Configuracao;
import br.com.assessment.domain.entity.usuario.Perfil;
import br.com.assessment.infrastructure.file.ImageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.Part;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.concurrent.TimeUnit;

@RestController
@RequiredArgsConstructor
@RequestMapping("configuracoes")
public class ConfiguracaoResource {

    private final ConfiguracaoService configuracaoService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Configuracao> save(@RequestBody final Configuracao configuracao) {
        return Mono.just(this.configuracaoService.save(configuracao));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Configuracao> update(@PathVariable final long id, @RequestBody final Configuracao configuracao) {
        return Mono.just(this.configuracaoService.save(id, configuracao));
    }

    @GetMapping()
    public Mono<Configuracao> getConfiguracao() {
        return Mono.just(this.configuracaoService.getConfiguracao());
    }

    /**
     * Busca a logomarca
     * @param id
     * @return
     */
    @GetMapping(value = "{id}/logomarca", produces = {MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE})
    public Mono<ResponseEntity<byte[]>> findLogomarca(@PathVariable final long id) {
        return Mono.just(
                ResponseEntity.ok().cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
                        .body(this.configuracaoService.findLogomarca(id))
        );
    }

    /**
     * Salva a logomarca
     * @param id
     * @param file
     * @return
     */
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    @PostMapping(value = "{id}/logomarca", produces = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Flux<String> saveLogomarca(@PathVariable final long id, @RequestPart("file") Flux<Part> file) {

        return file
                .filter(part -> part instanceof FilePart) // only retain file parts
                .ofType(FilePart.class)
                .flatMap(ImageUtils::getBytes)
                .map((byte[] bytes) -> this.configuracaoService.saveLogomarca(id, bytes));

    }


    /**
     * Deleta a logomarca
     * @param id
     * @return
     */
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    @DeleteMapping("{id}/logomarca")
    public Mono<Boolean> deleteLogomarca(@PathVariable final long id) {
        this.configuracaoService.deleteLogomarca(id);
        return Mono.just(true);
    }

    /**
     * Busca o background
     * @param id
     * @return
     */
    @GetMapping(value = "{id}/background", produces = {MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE})
    public Mono<ResponseEntity<byte[]>> findBackground(@PathVariable final long id) {
        return Mono.just(
                ResponseEntity.ok().cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
                        .body(this.configuracaoService.findBackground(id))
        );
    }

    /**
     * Salva o background
     * @param id
     * @param file
     * @return
     */
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    @PostMapping(value = "{id}/background", produces = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Flux<String> saveBackground(@PathVariable final long id, @RequestPart("file") Flux<Part> file) {

        return file
                .filter(part -> part instanceof FilePart) // only retain file parts
                .ofType(FilePart.class)
                .flatMap(ImageUtils::getBytes)
                .map((byte[] bytes) -> this.configuracaoService.saveBackground(id, bytes));

    }

    /**
     * Deleta o background
     * @param id
     * @return
     */
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    @DeleteMapping("{id}/background")
    public Mono<Boolean> deleteBackground(@PathVariable final long id) {
        this.configuracaoService.deleteBackground(id);
        return Mono.just(true);
    }



}