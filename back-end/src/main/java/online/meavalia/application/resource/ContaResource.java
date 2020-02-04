package online.meavalia.application.resource;

import lombok.AllArgsConstructor;
import online.meavalia.domain.entity.usuario.Conta;
import online.meavalia.domain.entity.usuario.Perfil;
import online.meavalia.domain.ContaService;
import online.meavalia.infrastructure.resource.AbstractResource;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@RestController
@AllArgsConstructor
@RequestMapping({"**contas", "**public/contas", "**sistema/contas", "**sistema/mobile/contas"})
public class ContaResource extends AbstractResource<Conta> {

    /**
     *
     */
    private final ContaService contaService;

    /**
     * @param email {String}
     * @return Mono<UserDetails>
     */
    @GetMapping(params = "email")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ATENDENTE_VALUE + "')")
    public Mono<UserDetails> findUsuarioByEmail(@RequestParam final String email) {
        return this.contaService.findUsuarioByEmail(email);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ROOT_VALUE + "')")
    Mono<Page<Conta>> listClientesByFilters(final String defaultFilter) {
        return Mono.just(contaService.listClientesByFilters(defaultFilter, getPageable()));
    }

    // TODO mudar para configuração
    @GetMapping("accept-scheme/{scheme}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ROOT_VALUE + "')")
    Mono<Boolean> acceptScheme(final ServerWebExchange exchange, @PathVariable final String scheme) {
        return contaService.acceptScheme(exchange, scheme);
    }

}
