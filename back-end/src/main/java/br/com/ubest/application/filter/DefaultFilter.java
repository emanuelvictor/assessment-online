package br.com.ubest.application.filter;

import br.com.ubest.application.context.LocalContext;
import br.com.ubest.domain.entity.usuario.Conta;
import br.com.ubest.infrastructure.org.springframework.data.domain.PageRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;


@Component
@RequiredArgsConstructor
public class DefaultFilter implements WebFilter {


    /**
     * @param serverWebExchange ServerWebExchange
     * @param webFilterChain    WebFilterChain
     * @return Mono<Void>
     */
    @Override
    public Mono<Void> filter(ServerWebExchange serverWebExchange,
                             WebFilterChain webFilterChain) {

        LocalContext.setPageable(PageRequest.of(serverWebExchange));

        return ReactiveSecurityContextHolder.getContext()
                .switchIfEmpty(
                        webFilterChain.filter(serverWebExchange).flatMap(aVoid -> Mono.empty())
                )
                .map(securityContext -> {
                    if (securityContext.getAuthentication() != null) {
                        final Conta conta = ((Conta) securityContext.getAuthentication().getPrincipal());

                        LocalContext.setCurrentScheme(conta.getEsquema());
                        LocalContext.setCurrentUsername(conta.getUsername());

                        if (conta.isRoot()) {
                            // Se for root seta como esquema atual o esquema escolhido pelo root
                            LocalContext.setCurrentScheme(LocalContext.getRootCurrentScheme(LocalContext.getCurrentUsername()));
                        }

                    }
                    return webFilterChain.filter(serverWebExchange);
                })
                .map(authentication -> webFilterChain.filter(serverWebExchange)).flatMap(voidMono -> voidMono);
    }

}
