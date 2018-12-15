package br.com.assessment.domain.resource;

import br.com.assessment.application.context.LocalContext;
import br.com.assessment.domain.entity.configuracao.Configuracao;
import br.com.assessment.domain.entity.usuario.Perfil;
import br.com.assessment.domain.service.ConfiguracaoService;
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
@RequestMapping({"**configuracoes", "**sistema/configuracoes", "**sistema/mobile/configuracoes"})
public class ConfiguracaoResource {

    private final ConfiguracaoService configuracaoService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Configuracao> save(@RequestBody final Configuracao configuracao) {
        return Mono.just(this.configuracaoService.save(configuracao));
    }

    @GetMapping("{username}")
    public Mono<StringBuffer> getSchemaByUsername(final @PathVariable String username) {
        return Mono.just(this.configuracaoService.getSchemaByUsername(username));
    }

    @GetMapping
    public Mono<Configuracao> getConfiguracao() {
        return Mono.just(this.configuracaoService.getConfiguracao());
    }

    /**
     * Busca a logomarca
     */
    @GetMapping(value = "logomarca", produces = {MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE})
    public Mono<ResponseEntity<byte[]>> findLogomarca(final @RequestParam(value = "cliente", required = false) String cliente) {
        return Mono.just(
                ResponseEntity.ok().cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
                        .body(this.configuracaoService.findLogomarca(cliente == null ? LocalContext.getCurrentSchema() : cliente))
        );
    }

    /**
     * Salva a logomarca
     */
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    @PostMapping(value = "logomarca", produces = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Flux<String> saveLogomarca(@RequestPart("file") Flux<Part> file) {
        return file
                .filter(part -> part instanceof FilePart) // only retain file parts
                .ofType(FilePart.class)
                .flatMap(ImageUtils::getBytes)
                .map(this.configuracaoService::saveLogomarca);
    }


    /**
     * Deleta a logomarca
     */
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    @DeleteMapping("logomarca")
    public Mono<Boolean> deleteLogomarca() {
        this.configuracaoService.deleteLogomarca();
        return Mono.just(true);
    }

    /**
     * Busca o background
     */
    @GetMapping(value = "background", produces = {MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE})
    public Mono<ResponseEntity<byte[]>> findBackgroundByCliente(final @RequestParam(value = "cliente", required = false) String cliente) {
        return Mono.just(
                ResponseEntity.ok().cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES))
                        .body(this.configuracaoService.findBackground(cliente == null ? LocalContext.getCurrentSchema() : cliente))
        );
    }

    /**
     * Salva o background
     */
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    @PostMapping(value = "background", produces = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Flux<String> saveBackground(@RequestPart("file") Flux<Part> file) {

        return file
                .filter(part -> part instanceof FilePart) // only retain file parts
                .ofType(FilePart.class)
                .flatMap(ImageUtils::getBytes)
                .map(this.configuracaoService::saveBackground);

    }

    /**
     * Deleta o background
     */
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    @DeleteMapping("background")
    public Mono<Boolean> deleteBackground() {
        this.configuracaoService.deleteBackground();
        return Mono.just(true);
    }


}