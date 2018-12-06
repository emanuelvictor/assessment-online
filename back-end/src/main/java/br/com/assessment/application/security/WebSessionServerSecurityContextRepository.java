package br.com.assessment.application.security;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.util.Assert;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;

import org.springframework.web.server.WebSession;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * Stores the {@link SecurityContext} in the
 * {@link org.springframework.web.server.WebSession}. When a {@link SecurityContext} is
 * saved, the session id is changed to prevent session fixation attacks.
 * @author Rob Winch
 * @since 5.0
 */
public class WebSessionServerSecurityContextRepository
        implements ServerSecurityContextRepository {

    /**
     * The default session attribute name to save and load the {@link SecurityContext}
     */
    public static final String DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME = "SPRING_SECURITY_CONTEXT";

    private String springSecurityContextAttrName = DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME;

    /**
     * Sets the session attribute name used to save and load the {@link SecurityContext}
     * @param springSecurityContextAttrName the session attribute name to use to save and
     * load the {@link SecurityContext}
     */
    public void setSpringSecurityContextAttrName(String springSecurityContextAttrName) {
        Assert.hasText(springSecurityContextAttrName, "springSecurityContextAttrName cannot be null or empty");
        this.springSecurityContextAttrName = springSecurityContextAttrName;
    }

    public Mono<Void> save(ServerWebExchange exchange, SecurityContext context) {
        return exchange.getSession()
                .doOnNext(session -> {
                    if (context == null) {
                        session.getAttributes().remove(this.springSecurityContextAttrName);
                    } else {
                        session.getAttributes().put(this.springSecurityContextAttrName, context);
                    }
                })
                .flatMap(session -> session.changeSessionId());
    }

    public Mono<SecurityContext> load(ServerWebExchange exchange) {
        System.out.println(exchange.getRequest().getCookies());
        return exchange.getSession()
                .map(WebSession::getAttributes)
                .flatMap( attrs -> {
                    SecurityContext context = (SecurityContext) attrs.get(this.springSecurityContextAttrName);
                    return Mono.justOrEmpty(context);
                });
    }


//        @Override
//        public Mono<SecurityContext> load(ServerWebExchange exchange) {
//            List<String> tokens = exchange.getRequest().getHeaders().get("X-Auth-Token");
//            String token = (tokens != null && !tokens.isEmpty()) ? tokens.get(0) : null;
//
//            Mono<Authentication> authMono = reactiveAuthenticationManager
//                    .authenticate( new HttpRequestHeaderToken(token) );
//
//            return authMono
//                    .map( auth -> (SecurityContext)new SecurityContextImpl(auth))
//                    .onErrorMap(
//                            er -> er instanceof AuthenticationException,
//                            autEx -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, autEx.getMessage(), autEx)
//                    );
//            )
//        }

}

