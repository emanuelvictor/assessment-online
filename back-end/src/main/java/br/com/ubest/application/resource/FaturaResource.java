package br.com.ubest.application.resource;

import br.com.ubest.domain.entity.assinatura.Cupom;
import br.com.ubest.domain.entity.assinatura.Fatura;
import br.com.ubest.domain.service.FaturaService;
import br.com.ubest.infrastructure.resource.AbstractResource;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Optional;

import static br.com.ubest.domain.entity.usuario.Perfil.ADMINISTRADOR_VALUE;
import static br.com.ubest.domain.entity.usuario.Perfil.ATENDENTE_VALUE;

/**
 * @author Emanuel Victor
 * @version 1.0.0
 * @since 1.0.0, 10/09/2019
 */
@RestController
@RequiredArgsConstructor
@RequestMapping({"**faturas", "**sistema/faturas", "**sistema/mobile/faturas"})
public class FaturaResource extends AbstractResource<Fatura> {

    /**
     *
     */
    private final FaturaService faturaService;

    /**
     * @param defaultFilter String
     * @return Mono<Page < Cupom>>
     */
    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + ADMINISTRADOR_VALUE + "')")
    Mono<Page<Fatura>> listByFilters(final String defaultFilter) {
        return Mono.just(faturaService.listByFilters(defaultFilter, getPageable()));
    }

    /**
     * @param id Long
     * @return Mono<Optional < Cupom>>
     */
    @GetMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + ADMINISTRADOR_VALUE + "')")
    Mono<Optional<Fatura>> findById(@PathVariable final long id) {
        return Mono.just(faturaService.findById(id));
    }

}
