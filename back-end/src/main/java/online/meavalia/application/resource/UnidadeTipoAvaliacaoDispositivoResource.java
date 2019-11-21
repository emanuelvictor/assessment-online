package online.meavalia.application.resource;

import lombok.RequiredArgsConstructor;
import online.meavalia.domain.entity.unidade.UnidadeTipoAvaliacaoDispositivo;
import online.meavalia.domain.entity.usuario.Perfil;
import online.meavalia.domain.repository.UnidadeTipoAvaliacaoDispositivoRepository;
import online.meavalia.infrastructure.resource.AbstractResource;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping({"**unidades-tipos-avaliacoes-dispositivo", "**public/unidades-tipos-avaliacoes-dispositivo", "**sistema/unidades-tipos-avaliacoes-dispositivo", "**sistema/mobile/unidades-tipos-avaliacoes-dispositivo"})
public class UnidadeTipoAvaliacaoDispositivoResource extends AbstractResource<UnidadeTipoAvaliacaoDispositivo> {

    /**
     *
     */
    private final UnidadeTipoAvaliacaoDispositivoRepository unidadeTipoAvaliacaoDispositivoRepository;

    /**
     * @param unidadeTipoAvaliacaoDispositivo
     * @return
     */
    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<UnidadeTipoAvaliacaoDispositivo> save(@RequestBody final UnidadeTipoAvaliacaoDispositivo unidadeTipoAvaliacaoDispositivo) {
        return Mono.just(this.unidadeTipoAvaliacaoDispositivoRepository.save(unidadeTipoAvaliacaoDispositivo));
    }

    /**
     * @param id
     * @param unidadeTipoAvaliacaoDispositivo
     * @return
     */
    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<UnidadeTipoAvaliacaoDispositivo> update(@PathVariable final long id, @RequestBody final UnidadeTipoAvaliacaoDispositivo unidadeTipoAvaliacaoDispositivo) {
        unidadeTipoAvaliacaoDispositivo.setId(id);
        return Mono.just(this.unidadeTipoAvaliacaoDispositivoRepository.save(unidadeTipoAvaliacaoDispositivo));
    }

    /**
     * @param id
     * @return
     */
    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Boolean> delete(@PathVariable final long id) {
        this.unidadeTipoAvaliacaoDispositivoRepository.deleteById(id);
        return Mono.just(true);
    }

    /**
     * @param id
     * @return
     */
    @GetMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    public Mono<Optional<UnidadeTipoAvaliacaoDispositivo>> findById(@PathVariable final long id) {
        return Mono.just(this.unidadeTipoAvaliacaoDispositivoRepository.findById(id));
    }

    /**
     * @param defaultFilter
     * @param dispositivoId
     * @param unidadeTipoAvaliacaoId
     * @param ativo
     * @param withAvaliaveis
     * @return
     */
    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<Page<UnidadeTipoAvaliacaoDispositivo>> listByFilters(final String defaultFilter, final Long dispositivoId, final Long unidadeTipoAvaliacaoId, final Boolean ativo, final Boolean withAvaliaveis) {
        return Mono.just(this.unidadeTipoAvaliacaoDispositivoRepository.listByFilters(defaultFilter, dispositivoId, unidadeTipoAvaliacaoId, ativo, withAvaliaveis, getPageable()));
    }

}
