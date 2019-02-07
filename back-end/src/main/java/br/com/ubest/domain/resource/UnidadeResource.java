package br.com.ubest.domain.resource;

import br.com.ubest.domain.entity.unidade.Unidade;
import br.com.ubest.domain.entity.usuario.Perfil;
import br.com.ubest.domain.entity.usuario.Usuario;
import br.com.ubest.domain.service.UnidadeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static br.com.ubest.application.context.LocalContext.getPageable;

@RestController
@RequiredArgsConstructor
@RequestMapping({"**unidades", "**sistema/unidades", "**sistema/mobile/unidades"})
public class UnidadeResource {

    private final UnidadeService unidadeService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Unidade> save(@RequestBody final Unidade unidade) {
        return Mono.just(this.unidadeService.save(unidade));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Unidade> save(@PathVariable final long id, @RequestBody final Unidade unidade) {
        return Mono.just(this.unidadeService.save(id, unidade));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Boolean> delete(@PathVariable final long id) {
        this.unidadeService.delete(id);
        return Mono.just(true);
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    public Mono<Optional<Unidade>> findById(@PathVariable final long id) {
        return Mono.just(this.unidadeService.findById(id));
    }

    @GetMapping("{id}/estatisticas")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<Optional<Unidade>> findUnidadeById(@PathVariable final long id,
                                            @RequestParam(required = false) final LocalDateTime dataInicioFilter,
                                            @RequestParam(required = false) final LocalDateTime dataTerminoFilter) {
        return Mono.just(unidadeService.findUnidadeById(id, dataInicioFilter, dataTerminoFilter));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<Page<Unidade>> listByFilters(final String defaultFilter, final String enderecoFilter,
                                      @RequestParam(required = false) final LocalDateTime dataInicioFilter,
                                      @RequestParam(required = false) final LocalDateTime dataTerminoFilter) {
        return Mono.just(this.unidadeService.listByFilters(defaultFilter, enderecoFilter, dataInicioFilter, dataTerminoFilter, getPageable()));
    }

    /**
     * Lista todas as unidades pelo id do usuário.
     *
     * @param usuarioId {long}
     * @return Mono<List < Unidade>>
     */
    @GetMapping("by-usuario") //TODO gambitinho
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<List<Unidade>> listByUsuarioId(@RequestParam final long usuarioId) {
        return Mono.just(this.unidadeService.listByUsuarioId(usuarioId));
    }

    @GetMapping("light")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<Page<Unidade>> listByFilters(final String defaultFilter) {
        return Mono.just(this.unidadeService.listByFilters(defaultFilter, getPageable()));
    }

    @GetMapping("authenticate/{unidadeId}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    Mono<Boolean> authenticateByUnidadeId(@PathVariable final long unidadeId, @RequestParam final String password) {
        return Mono.just(this.unidadeService.authenticateByUnidadeId(unidadeId, password));
    }

    @GetMapping("{unidadeId}/hashs")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    Mono<List<String>> getHashsByUnidadeId(@PathVariable final long unidadeId) {
        return Mono.just(this.unidadeService.getHashsByUnidadeId(unidadeId));
    }
}