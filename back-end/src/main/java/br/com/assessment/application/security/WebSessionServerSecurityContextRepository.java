package br.com.assessment.application.security;

import br.com.assessment.domain.entity.usuario.Conta;
import br.com.assessment.domain.entity.usuario.Sessao;
import br.com.assessment.domain.repository.ContaRepository;
import br.com.assessment.domain.repository.SessaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpCookie;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.util.Assert;
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
    private static final String DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME = "SPRING_SECURITY_CONTEXT";

    /**
     *
     */
    public static final String TOKEN_NAME = "assessment-token";

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
//                        System.out.println(exchange.getResponse().getCookies());
//                        System.out.println(exchange.getRequest().getCookies());
//                        session.getAttributes().remove(TOKEN_NAME);
                        //TODO fazer aqui o handler de remover token da base, assim não precisa ser lá no logout, ou não né ...
                    } else {

                        final Sessao sessao = new Sessao();
                        sessao.setUsername(context.getAuthentication().getName());
                        sessao.generateToken();
                        this.sessaoRepository.save(sessao);
//                        System.out.println("remove address " + exchange.getRequest().getRemoteAddress());
                        // Adiciona cookie de armazenamento de sessão
//                        final ResponseCookie httpCookie = ResponseCookie.from(TOKEN_NAME, sessao.getToken())
//                                .domain(Objects.requireNonNull(exchange.getRequest().getRemoteAddress()).getHostName())
//                                .path("/")
//                                .build();

//                        session.getAttributes().put(TOKEN_NAME, sessao.getToken());

                        exchange.getResponse().addCookie(ResponseCookie.from(TOKEN_NAME, sessao.getToken())
                                .build());

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
//                    final SecurityContext context = (SecurityContext) attrs.get(this.springSecurityContextAttrName);
//
//                    if (context != null && exchange.getRequest().getCookies().get(TOKEN_NAME) != null)
//                        return Mono.just(context);
////                    return Mono.justOrEmpty(context);

                    final List<HttpCookie> cookies = exchange.getRequest().getCookies().get(TOKEN_NAME);

                    if (cookies == null || cookies.isEmpty())
                        return Mono.empty();

                    final String token = /*(String) attrs.get(TOKEN_NAME);*/ cookies.get(0).getValue();
                    final Sessao sessao = sessaoRepository.findByToken(token);

                    if (sessao == null || !sessao.validate()) {
                        return Mono.empty();
                    }

                    System.out.println("ID da sessão " + sessao.getId());
                    final Conta conta = contaRepository.findByEmailIgnoreCase(sessao.getUsername());

                    // Cria a autenticação
                    final Authentication authentication = new UsernamePasswordAuthenticationToken(conta, conta.getPassword(), conta.getAuthorities());

                    // Cria o contexto de segurança
                    final SecurityContextImpl securityContext = new SecurityContextImpl(authentication);

                    return Mono.just(securityContext); //this.falcatrua(exchange, securityContext).map(auth -> securityContext);

                });

    }


    private Mono<Void> falcatrua(ServerWebExchange exchange, SecurityContext context) {
        return exchange.getSession()
                .doOnNext(session -> {
                    if (context == null) {
                        session.getAttributes().remove(this.springSecurityContextAttrName);
                    } else {
                        session.getAttributes().put(this.springSecurityContextAttrName, context);
                    }
                })
                .flatMap(WebSession::changeSessionId);
    }

}

