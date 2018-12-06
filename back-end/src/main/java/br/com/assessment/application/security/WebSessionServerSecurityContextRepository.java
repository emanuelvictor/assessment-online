package br.com.assessment.application.security;

import br.com.assessment.domain.entity.usuario.Conta;
import br.com.assessment.domain.entity.usuario.Sessao;
import br.com.assessment.domain.repository.ContaRepository;
import br.com.assessment.domain.repository.SessaoRepository;
import jdk.nashorn.internal.objects.annotations.Constructor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
 *
 * @author Rob Winch
 * @since 5.0
 */
@Configuration
@RequiredArgsConstructor
public class WebSessionServerSecurityContextRepository implements ServerSecurityContextRepository {

    /**
     * The default session attribute name to save and load the {@link SecurityContext}
     */
    public static final String DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME = "SPRING_SECURITY_CONTEXT";

    /**
     *
     */
    private static final String TOKEN_NAME = "assessment-token";

    /**
     *
     */
    private String springSecurityContextAttrName = DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME;

    /**
     *
     */
    private final SessaoRepository sessaoRepository;

    /**
     * Sets the session attribute name used to save and load the {@link SecurityContext}
     *
     * @param springSecurityContextAttrName the session attribute name to use to save and
     *                                      load the {@link SecurityContext}
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

                        final Sessao sessao = new Sessao();
                        sessao.setUsername(context.getAuthentication().getName());
                        sessao.generateToken();
                        this.sessaoRepository.save(sessao);

                        // Adiciona cookie de armazenamento de sessão
                        exchange.getResponse().addCookie(ResponseCookie.from(TOKEN_NAME, sessao.getToken()).build());

                    }
                })
                .flatMap(WebSession::changeSessionId);
    }

    private final ContaRepository contaRepository;

    @Override
    public Mono<SecurityContext> load(ServerWebExchange exchange) {

        return exchange.getSession()
                .map(WebSession::getAttributes)
                .flatMap(attrs -> {
                    final SecurityContext context = (SecurityContext) attrs.get(this.springSecurityContextAttrName);

                    if (context != null)
                        return Mono.just(context);
//                    return Mono.justOrEmpty(context);

                    final List<HttpCookie> cookies = exchange.getRequest().getCookies().get(TOKEN_NAME);

                    if (cookies == null || cookies.isEmpty())
                        return Mono.empty();

                    final String token = cookies.get(0).getValue();

                    final Sessao sessao = sessaoRepository.findByToken(token);

                    if (sessao == null || !sessao.validate()) {
                        return Mono.empty();
                    }

                    final Conta conta = contaRepository.findByEmailIgnoreCase(sessao.getUsername());

                    // Cria a autenticação
                    final Authentication authentication = new UsernamePasswordAuthenticationToken(conta, conta.getPassword(), conta.getAuthorities());

                    // Cria o contexto de segurança
                    final SecurityContextImpl securityContext = new SecurityContextImpl(authentication);

                    return this.save(exchange, securityContext)
                            .map(auth -> securityContext);

//                    final Mono<Authentication> authMono = reactiveAuthenticationManager.authenticate(authentication);
//                    return authMono
//                            .map(auth -> (SecurityContext) new SecurityContextImpl(auth))
//                            .onErrorMap(
//                                    er -> er instanceof AuthenticationException,
//                                    autEx -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, autEx.getMessage(), autEx)
//                            );

                });

    }

}

