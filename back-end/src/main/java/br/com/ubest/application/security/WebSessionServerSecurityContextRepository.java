package br.com.ubest.application.security;

import br.com.ubest.application.multitenancy.TenantIdentifierResolver;
import br.com.ubest.domain.entity.usuario.Sessao;
import br.com.ubest.domain.repository.SessaoRepository;
import br.com.ubest.infrastructure.org.springframework.data.domain.PageRequest;
import br.com.ubest.infrastructure.resource.Page;
import br.com.ubest.infrastructure.tenant.TenantDetails;
import br.com.ubest.infrastructure.tenant.TenantDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpCookie;
import org.springframework.http.ResponseCookie;
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

/**
 * Stores the {@link SecurityContext} in the
 * {@link org.springframework.web.server.WebSession}. When a {@link SecurityContext} is
 * saved, the session id is changed to prevent session fixation attacks.
 *
 * @author Rob Winch
 * @since 5.0
 */
@Configuration
@RequiredArgsConstructor
public class WebSessionServerSecurityContextRepository implements ServerSecurityContextRepository {

    /**
     *
     */
    private final SessaoRepository sessaoRepository;

    /**
     *
     */
    private final TenantDetailsService tenantDetailsService;

    /**
     * Armazena a paginação para os Resources Controllers
     */
    private final Page page;

    private final TenantIdentifierResolver tenantIdentifierResolver;

    public Mono<Void> save(ServerWebExchange exchange, SecurityContext context) {
        return exchange.getSession()
                .doOnNext(session -> {

                    if (context != null) {
                        final Sessao sessao = new Sessao();
                        sessao.setUsername(context.getAuthentication().getName());
                        sessao.generateToken();
                        this.sessaoRepository.save(sessao);

                        exchange.getResponse().addCookie(ResponseCookie.from(TOKEN_NAME, sessao.getToken())
                                .build());
                    }

                })
                .flatMap(WebSession::changeSessionId);
    }

    @Override
    public Mono<SecurityContext> load(ServerWebExchange exchange) {

        return exchange.getSession()
                .map(WebSession::getAttributes)
                .flatMap(attrs -> {

                    // Populo pageable
                    page.setPageable(PageRequest.of(exchange));

                    final List<HttpCookie> cookies = exchange.getRequest().getCookies().get(TOKEN_NAME);

                    if (cookies == null || cookies.isEmpty())
                        return Mono.empty();

                    final String token = cookies.get(0).getValue();
                    final Sessao sessao = sessaoRepository.findByToken(token);

                    if (sessao == null || !sessao.validate()) {
                        return Mono.empty();
                    }

                    final TenantDetails tenantDetails = tenantDetailsService.findTenantDetailsByUsername(sessao.getUsername());

                    if (attrs.get("schema") != null)
                        tenantIdentifierResolver.setSchema((String) attrs.get("schema"));
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

