package br.com.ubest.application.security;

import br.com.ubest.application.multitenancy.TenantIdentifierResolver;
import br.com.ubest.domain.entity.usuario.Sessao;
import br.com.ubest.infrastructure.org.springframework.data.domain.PageRequest;
import br.com.ubest.infrastructure.resource.PageComponent;
import br.com.ubest.infrastructure.tenant.TenantDetails;
import br.com.ubest.infrastructure.tenant.TenantDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.session.ReactiveSessionRepository;
import org.springframework.session.data.redis.ReactiveRedisOperationsSessionRepository;
import org.springframework.session.web.server.session.SpringSessionWebSessionStore;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebSession;
import reactor.core.publisher.Mono;

import static org.springframework.security.web.server.context.WebSessionServerSecurityContextRepository.DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME;

/**
 *
 */
@Configuration
@RequiredArgsConstructor
public class WebSessionServerSecurityContextRepository implements ServerSecurityContextRepository {

    /**
     * Armazena a paginação para os Resources Controllers
     */
    private final PageComponent pageComponent;

    /**
     *
     */
    private final TenantDetailsService tenantDetailsService;

//    /**
//     *
//     */
//    private final ReactiveRedisOperationsSessionRepository<Sessao> reactiveSessionRepository;

    /**
     *
     */
    private final TenantIdentifierResolver tenantIdentifierResolver;

    /**
     * @param exchange {ServerWebExchange}
     * @param context  {SecurityContext}
     * @return Mono<Void>
     */
    public Mono<Void> save(final ServerWebExchange exchange, final SecurityContext context) {
        return exchange.getSession()
                .doOnNext(session -> {
                    if (context != null) {
//                        ((Sessao) ((SpringSessionWebSessionStore.SpringSessionWebSession) session).getSession()).setUsername(context.getAuthentication().getName());
                        session.getAttributes().put(DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME, context);
//                        session.getAttributes().put("username", context.getAuthentication().getName());
                    } else {
//                        ((Sessao) ((SpringSessionWebSessionStore.SpringSessionWebSession) session).getSession()).setUsername(null);
//                        session.getAttributes().remove("username");
                        session.getAttributes().remove(DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME);
                    }
                })
                .flatMap(WebSession::save);
    }

    /**
     * @param exchange {ServerWebExchange}
     * @return Mono<SecurityContext>
     */
    @Override
    public Mono<SecurityContext> load(final ServerWebExchange exchange) {

        return exchange.getSession()

                .flatMap(webSession -> {

                    // Populo pageable
                    pageComponent.setPageable(PageRequest.of(exchange));

//                    return reactiveSessionRepository.findById(webSession.getId()).flatMap(session -> {
                    if (webSession == null || webSession.isExpired())
                        return Mono.empty();
                        // Se tem a sessão no banco, mas ela está sem o username (quer dizer que o cara deslogou)
                        // Então delete a sessão do banco
                    else if (webSession.getAttributes().get(DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME) == null) {
                        return Mono.empty();
                    }

                    if (webSession.getAttributes().get("schema") != null) // TODO colocar a palavra schema em outro lugar
                        tenantIdentifierResolver.setSchema((String) webSession.getAttributes().get("schema"));
                    else
                        tenantIdentifierResolver.setSchema(((TenantDetails) ((SecurityContextImpl)  webSession.getAttributes().get(DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME)).getAuthentication().getPrincipal()).getTenant());

                    tenantIdentifierResolver.setUsername(((TenantDetails) ((SecurityContextImpl)  webSession.getAttributes().get(DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME)).getAuthentication().getPrincipal()).getUsername());

                    return Mono.just((SecurityContextImpl) webSession.getAttributes().get(DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME));

                });

    }

}

