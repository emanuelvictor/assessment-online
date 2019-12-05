package online.meavalia.application.security;

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
     * @param exchange
     * @param webFilterChain
     * @return
     */
    @Override
    public Mono<Void> filter(final ServerWebExchange exchange, final WebFilterChain webFilterChain) {

        return ReactiveSecurityContextHolder.getContext()
                .switchIfEmpty(
                        webFilterChain.filter(exchange).flatMap(aVoid -> Mono.empty())
                )
                .map(securityContext -> webFilterChain.filter(exchange))
                .map(authentication -> webFilterChain.filter(exchange)).flatMap(voidMono -> voidMono);

    }
}
