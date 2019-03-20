package br.com.ubest.application.security;

import br.com.ubest.application.multitenancy.TenantIdentifierResolver;
import br.com.ubest.infrastructure.org.springframework.data.domain.PageRequest;
import br.com.ubest.infrastructure.resource.PageComponent;
import br.com.ubest.infrastructure.session.SessionDetails;
import br.com.ubest.infrastructure.session.SessionDetailsService;
import br.com.ubest.infrastructure.tenant.TenantDetails;
import br.com.ubest.infrastructure.tenant.TenantDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebSession;
import reactor.core.publisher.Mono;

import java.util.List;

import static br.com.ubest.Application.TOKEN_NAME;
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

    /**
     *
     */
    private final SessionDetailsService sessionDetailsService;

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

                    if (context == null) {
                        session.getAttributes().remove(DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME);
//                        sessionDetailsService.destroySession(session.getId());
                    } else {
                        session.getAttributes().put(DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME, context);
                        sessionDetailsService.createSession(context.getAuthentication().getName(), session.getId());
                    }

                })
                .flatMap(webSession -> Mono.empty());
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

                    final List<HttpCookie> cookies = exchange.getRequest().getCookies().get(TOKEN_NAME);
//
//                    if (cookies == null || cookies.isEmpty())
//                        return Mono.empty();

                    System.out.println("session id " +webSession.getId());
                    final String token = cookies.get(0).getValue();
//                    final String token = webSession.getId();
                    System.out.println(token);
                    final SessionDetails sessionDetails = sessionDetailsService.findByToken(token);

                    if (sessionDetails == null || !sessionDetails.validate())
                        return Mono.empty();

                    final TenantDetails tenantDetails = tenantDetailsService.findTenantDetailsByUsername(sessionDetails.getUsername());

                    if (webSession.getAttributes().get("schema") != null) // TODO colocar a palavra schema em outro lugar
                        tenantIdentifierResolver.setSchema((String) webSession.getAttributes().get("schema"));
                    else
                        tenantIdentifierResolver.setSchema(tenantDetails.getTenant());

                    tenantIdentifierResolver.setUsername(tenantDetails.getUsername());

                    // Cria a autenticação
                    final Authentication authentication = new UsernamePasswordAuthenticationToken(tenantDetails, tenantDetails.getPassword(), tenantDetails.getAuthorities());

                    // Cria o contexto de segurança
                    final SecurityContextImpl securityContext = new SecurityContextImpl(authentication);

                    return Mono.just(securityContext);

                });

    }

}

