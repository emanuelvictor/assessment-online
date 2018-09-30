package br.com.assessment.domain.resource;

import br.com.assessment.domain.entity.configuracao.Configuracao;
import br.com.assessment.domain.entity.usuario.Perfil;
import br.com.assessment.domain.service.ConfiguracaoService;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/configuracoes")
@AllArgsConstructor
public class ConfiguracaoResource {

    private final ConfiguracaoService configuracaoService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Configuracao> save(@RequestBody final Configuracao configuracao) {
        return Mono.just(this.configuracaoService.save(configuracao));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Configuracao> save(@PathVariable final long id, @RequestBody final Configuracao configuracao) {
        return Mono.just(this.configuracaoService.save(id, configuracao));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Boolean> delete(@PathVariable final long id) {
        this.configuracaoService.delete(id);
        return Mono.just(true);
    }

    @GetMapping
    Flux<Configuracao> findAll() {
        return Flux.fromIterable(this.configuracaoService.findAll());
    }

}