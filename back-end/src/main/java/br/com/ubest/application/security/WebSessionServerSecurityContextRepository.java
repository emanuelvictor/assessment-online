package br.com.ubest.application.security;

import br.com.ubest.application.multitenancy.TenantIdentifierResolver;
import br.com.ubest.domain.entity.usuario.Sessao;
import br.com.ubest.infrastructure.org.springframework.data.domain.PageRequest;
import br.com.ubest.infrastructure.resource.PageComponent;
import br.com.ubest.infrastructure.tenant.TenantDetails;
import br.com.ubest.infrastructure.tenant.TenantDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.session.ReactiveSessionRepository;
import org.springframework.session.web.server.session.SpringSessionWebSessionStore;
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
    private final TenantDetailsService tenantDetailsService;

    /**
     *
     */
    private final ReactiveSessionRepository<Sessao> reactiveSessionRepository;

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
                        ((Sessao) ((SpringSessionWebSessionStore.SpringSessionWebSession) session).getSession()).setUsername(context.getAuthentication().getName());
                        session.getAttributes().put(DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME, context);
                    } else {
                        ((Sessao) ((SpringSessionWebSessionStore.SpringSessionWebSession) session).getSession()).setUsername(null);
//                        session.getAttributes().remove(DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME);
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

                    return reactiveSessionRepository.findById(webSession.getId()).flatMap(session -> {
                        if (session == null || session.isExpired())
                            return Mono.empty();
                            // Se tem a sessão no banco, mas ela está sem o username (quer dizer que o cara deslogou)
                            // Então delete a sessão do banco
                        else if (session.getUsername() == null) {
                            return Mono.empty();
                        }

                        final TenantDetails tenantDetails = tenantDetailsService.findTenantDetailsBySessionId(session.getId());

                        if (LocalMap.getInstance().getMap().get("schema") != null) // TODO colocar a palavra schema em outro lugar
                            tenantIdentifierResolver.setSchema((String) LocalMap.getInstance().getMap().get("schema"));
                        else
                            tenantIdentifierResolver.setSchema(tenantDetails.getTenant());

                        tenantIdentifierResolver.setUsername(tenantDetails.getUsername());

                        // Cria a autenticação
                        final Authentication authentication = new UsernamePasswordAuthenticationToken(tenantDetails, tenantDetails.getPassword(), tenantDetails.getAuthorities());

                        // Cria o contexto de segurança
                        final SecurityContextImpl securityContext = new SecurityContextImpl(authentication);

                        return Mono.just(securityContext);
                    });

                });

    }

}

