package br.com.ubest.domain.resource;

import br.com.ubest.domain.entity.unidade.Dispositivo;
import br.com.ubest.domain.entity.unidade.Unidade;
import br.com.ubest.domain.entity.unidade.UnidadeTipoAvaliacaoDispositivo;
import br.com.ubest.domain.entity.usuario.Perfil;
import br.com.ubest.domain.repository.DispositivoRepository;
import br.com.ubest.domain.repository.UnidadeTipoAvaliacaoDispositivoRepository;
import br.com.ubest.domain.service.DispositivoService;
import br.com.ubest.infrastructure.resource.AbstractResource;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;

import static br.com.ubest.infrastructure.suport.Utils.getListFromArray;

@RestController
@RequiredArgsConstructor
@RequestMapping({"**dispositivos", "**sistema/dispositivos", "**sistema/mobile/dispositivos"})
public class DispositivoResource extends AbstractResource<Dispositivo> {

    private final DispositivoService dispositivoService;

    private final DispositivoRepository dispositivoRepository;

    private final UnidadeTipoAvaliacaoDispositivoRepository unidadeTipoAvaliacaoDispositivoRepository;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Dispositivo> save(@RequestBody final Dispositivo dispositivo) {
        dispositivo.getUnidadesTiposAvaliacoesDispositivo().forEach(unidadeTipoAvaliacaoDispositivo -> unidadeTipoAvaliacaoDispositivo.setDispositivo(dispositivo));
        return Mono.just(this.dispositivoRepository.save(dispositivo));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Dispositivo> update(@PathVariable final long id, @RequestBody final Dispositivo dispositivo) {
        dispositivo.setId(id);
        return Mono.just(this.dispositivoRepository.save(dispositivo));
    }

    @PutMapping("{id}/unidadesTiposAvaliacoesDispositivo")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<List<UnidadeTipoAvaliacaoDispositivo>> saveUnidadesTiposAvaliacoesDispositivo(@PathVariable final long id, @RequestBody final UnidadeTipoAvaliacaoDispositivo[] unidadesTiposAvaliacoesDispositivo) {
        final List<UnidadeTipoAvaliacaoDispositivo> unidadeTipoAvaliacaoDispositivos = getListFromArray(unidadesTiposAvaliacoesDispositivo);
        unidadeTipoAvaliacaoDispositivos.forEach(unidadeTipoAvaliacaoDispositivo -> unidadeTipoAvaliacaoDispositivo.setDispositivo(new Dispositivo(id)));
        return Mono.just(this.unidadeTipoAvaliacaoDispositivoRepository.saveAll(unidadeTipoAvaliacaoDispositivos));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    public Mono<Boolean> delete(@PathVariable long id) {
        this.dispositivoRepository.deleteById(id);
        return Mono.just(true);
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    public Mono<Optional<Dispositivo>> findById(@PathVariable final long id) {
        return Mono.just(this.dispositivoRepository.findById(id));
    }


    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<Page<Dispositivo>> listByFilters(final String defaultFilter, final Boolean withBondFilter, final Boolean withAvaliaveisFilter, final Boolean withUnidadesTiposAvaliacoesAtivasFilter, final Long[] idsFilter) {
        return Mono.just(this.dispositivoService.listByFilters(defaultFilter, withBondFilter, withAvaliaveisFilter, withUnidadesTiposAvaliacoesAtivasFilter, getListFromArray(idsFilter), getPageable()));
    }

    /**
     * Lista todas as unidades pelo id do usuário.
     *
     * @param usuarioId {long}
     * @return Mono<List < Unidade>>
     */
    @GetMapping("by-usuario") //TODO gambitinho
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<List<Dispositivo>> listByUsuarioId(@RequestParam final long usuarioId) {
        return Mono.just(this.dispositivoRepository.listByUsuarioId(usuarioId));
    }

    @GetMapping("authenticate/{dispositivoId}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    Mono<Boolean> authenticateByDispositivoId(@PathVariable final long dispositivoId, @RequestParam final String password) {
        return Mono.just(this.dispositivoService.authenticateByDispositivoId(dispositivoId, password));
    }

    @GetMapping("{dispositivoId}/hashs")
    @PreAuthorize("hasAnyAuthority('" + Perfil.OPERADOR_VALUE + "')")
    Mono<List<String>> getHashsByDispositivoId(@PathVariable final long dispositivoId) {
        return Mono.just(this.dispositivoService.getHashsByDispositivoId(dispositivoId));
    }
}
