package online.meavalia.application.resource;

import lombok.RequiredArgsConstructor;
import online.meavalia.domain.entity.assinatura.fatura.Fatura;
import online.meavalia.domain.entity.usuario.Perfil;
import online.meavalia.domain.FaturaService;
import online.meavalia.infrastructure.resource.AbstractResource;
import online.meavalia.infrastructure.suport.Utils;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Optional;

/**
 * @author Emanuel Victor
 * @version 1.0.0
 * @since 1.0.0, 10/09/2019
 */
@RestController
@RequiredArgsConstructor
@RequestMapping({"**faturas", "**public/faturas", "**sistema/faturas", "**sistema/mobile/faturas"})
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
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    Mono<Page<Fatura>> listByFilters(final String defaultFilter, final Long[] dispositivosFilter) {
        final Page<Fatura> faturas = faturaService.listByFilters(defaultFilter, Utils.getListFromArray(dispositivosFilter), getPageable());
//        faturas.forEach(fatura -> fatura.getItens().forEach(item -> item.getFatura().setItens(null)));
        return Mono.just(faturas);
    }

    /**
     * @param id Long
     * @return Mono<Optional < Cupom>>
     */
    @GetMapping("{id}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    Mono<Optional<Fatura>> findById(@PathVariable final long id) {
        final Optional<Fatura> fatura = faturaService.findById(id);
        fatura.orElseThrow().getItens().forEach(item -> {
            final Fatura fatura1 = new Fatura(fatura.get().getTenant(), fatura.get().getAssinatura(), fatura.get().getCupom(), null);
            item.setFatura(fatura1);
        });
        return Mono.just(fatura);
    }


    /**
     * @return
     */
    @GetMapping("has-em-atraso")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    Mono<Boolean> hasEmAtraso() {
        return Mono.just(faturaService.hasEmAtraso());
    }

}
