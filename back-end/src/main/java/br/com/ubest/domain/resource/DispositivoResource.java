package br.com.ubest.domain.resource;

import br.com.ubest.domain.entity.unidade.Dispositivo;
import br.com.ubest.domain.entity.usuario.Perfil;
import br.com.ubest.domain.repository.DispositivoRepository;
import br.com.ubest.infrastructure.resource.AbstractResource;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping({"**dispositivos", "**sistema/dispositivos", "**sistema/mobile/dispositivos"})
public class DispositivoResource extends AbstractResource<Dispositivo> {

    private final DispositivoRepository dispositivoRepository;

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
    Mono<Page<Dispositivo>> listByFilters() {
        return Mono.just(this.dispositivoRepository.findAll(getPageable()));
    }

}