package online.meavalia.application.security;

import lombok.RequiredArgsConstructor;
import online.meavalia.Application;
import online.meavalia.application.tenant.TenantIdentifierResolver;
import online.meavalia.infrastructure.org.springframework.data.domain.PageRequest;
import online.meavalia.infrastructure.resource.PageComponent;
import online.meavalia.infrastructure.tenant.TenantDetails;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.web.server.ServerWebExchange;
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
                        session.getAttributes().remove(Application.SCHEMA_NAME);
                    }

                }).flatMap(webSession -> {
                    webSession.save();
                    return Mono.empty();
                });
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

                    if (webSession == null || webSession.isExpired()) {
                        if (webSession != null)
                            webSession.getAttributes().remove(Application.SCHEMA_NAME);
                        tenantIdentifierResolver.setSchema(Application.DEFAULT_TENANT_ID);
                        return Mono.empty();
                    }

                    // Se tem a sessão no banco, mas ela está sem o username (quer dizer que o cara deslogou)
                    // Então delete a sessão do banco
                    else if (webSession.getAttributes().get(DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME) == null) {
                        webSession.getAttributes().remove(Application.SCHEMA_NAME);
                        tenantIdentifierResolver.setSchema(Application.DEFAULT_TENANT_ID);
                        return Mono.empty();
                    }

                    final SecurityContext securityContext = ((SecurityContext) webSession.getAttributes().get(DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME));

                    if (webSession.getAttributes().get(Application.SCHEMA_NAME) != null)
                        tenantIdentifierResolver.setSchema((String) webSession.getAttributes().get(Application.SCHEMA_NAME));
                    else
                        tenantIdentifierResolver.setSchema(((TenantDetails) securityContext.getAuthentication().getPrincipal()).getTenant());

                    tenantIdentifierResolver.setUsername(securityContext.getAuthentication().getName());

                    return Mono.just(securityContext);

                });

    }

}

