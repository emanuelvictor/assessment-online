package br.com.assessment.application.multitenancy;

import br.com.assessment.domain.entity.usuario.Usuario;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;


@Component
public class TenantFilter implements WebFilter {

    /**
     *
     */
    @Override
    public Mono<Void> filter(ServerWebExchange serverWebExchange,
                             WebFilterChain webFilterChain) {
        return ReactiveSecurityContextHolder.getContext()
                .switchIfEmpty(
                        webFilterChain.filter(serverWebExchange).flatMap(aVoid -> Mono.empty())
                )
                .map(securityContext -> {
                    if (securityContext.getAuthentication() != null) {
                        TenantContext.setCurrentTenant(((Usuario) securityContext.getAuthentication().getPrincipal()).getTenant());
                    }
                    return webFilterChain.filter(serverWebExchange);
                })
                .map(authentication -> webFilterChain.filter(serverWebExchange)).flatMap(voidMono -> voidMono);
    }

}
