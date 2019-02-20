package br.com.ubest.domain.resource;

import br.com.ubest.domain.entity.usuario.Conta;
import br.com.ubest.domain.entity.usuario.Perfil;
import br.com.ubest.domain.entity.usuario.Usuario;
import br.com.ubest.domain.service.ContaService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import static br.com.ubest.application.context.LocalContext.getPageable;

@RestController
@AllArgsConstructor
@RequestMapping({"**contas", "**sistema/contas", "**sistema/mobile/contas"})
public class ContaResource {

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
    Mono<Page<Conta>> listByFilters(final String defaultFilter) {
        return Mono.just(contaService.listByFilters(defaultFilter, getPageable()));
    }

    @GetMapping("accept-scheme/{scheme}")
    @PreAuthorize("hasAnyAuthority('" + Perfil.ROOT_VALUE + "')")
    Mono<Boolean> acceptScheme(@PathVariable  final String scheme) {
        return Mono.just(contaService.acceptScheme(scheme));
    }

}
