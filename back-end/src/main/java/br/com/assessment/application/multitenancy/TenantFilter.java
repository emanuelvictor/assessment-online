package br.com.assessment.application.multitenancy;

import br.com.assessment.domain.entity.usuario.Conta;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;


@Component
@RequiredArgsConstructor
public class TenantFilter implements WebFilter {


    /**
     *
     * @param serverWebExchange ServerWebExchange
     * @param webFilterChain WebFilterChain
     * @return Mono<Void>
     */
    @Override
    public Mono<Void> filter(ServerWebExchange serverWebExchange,
                             WebFilterChain webFilterChain) {

//        paginationComponent.setSize(20/*serverWebExchange.getRequest().getQueryParams().get("size")*/);

        System.out.println(Context.getSize());
        Context.setSize(20);


        return ReactiveSecurityContextHolder.getContext()
                .switchIfEmpty(
                        webFilterChain.filter(serverWebExchange).flatMap(aVoid -> Mono.empty())
                )
                .map(securityContext -> {
                    if (securityContext.getAuthentication() != null) {
                        final Conta conta = ((Conta) securityContext.getAuthentication().getPrincipal());
                        Context.setCurrentSchema(conta.getEsquema());
                        Context.setCurrentUsername(conta.getUsername());
                    }
                    return webFilterChain.filter(serverWebExchange);
                })
                .map(authentication -> webFilterChain.filter(serverWebExchange)).flatMap(voidMono -> voidMono);
    }

}
