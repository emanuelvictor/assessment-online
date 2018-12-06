package br.com.assessment.application.security;

import br.com.assessment.domain.entity.usuario.Conta;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.security.web.server.authentication.ServerAuthenticationFailureHandler;
import org.springframework.security.web.server.authentication.ServerAuthenticationSuccessHandler;
import org.springframework.security.web.server.authentication.logout.LogoutWebFilter;
import org.springframework.security.web.server.authentication.logout.SecurityContextServerLogoutHandler;
import org.springframework.security.web.server.authentication.logout.ServerLogoutSuccessHandler;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.session.HeaderWebSessionIdResolver;
import org.springframework.web.server.session.WebSessionIdResolver;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.function.Function;

@Configuration
@RequiredArgsConstructor
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class SecurityConfiguration {

    /**
     *
     */
    private final ReactiveAuthenticationManager reactiveAuthenticationManager;

    /**
     *
     */
    private final ServerAuthenticationSuccessHandler serverAuthenticationSuccessHandler;

    /**
     *
     */
    private final ServerAuthenticationFailureHandler serverAuthenticationFailureHandler;

    /**
     *
     */
    private final ServerLogoutSuccessHandler serverLogoutSuccessHandler;

    /**
     *
     */
    private final ObjectMapper objectMapper;

    @Bean
    public WebSessionIdResolver webSessionIdResolver() {
        HeaderWebSessionIdResolver resolver = new HeaderWebSessionIdResolver();
        resolver.setHeaderName("X-AUTH-TOKEN");
        return resolver;
    }

    /**
     * @param mapper {ObjectMapper}
     * @return {Function<ServerWebExchange, Mono<Authentication>>}
     */
    private static Function<ServerWebExchange, Mono<Authentication>> jsonBodyAuthenticationConverter(final ObjectMapper mapper) {
        return exchange -> exchange
                .getRequest()
                .getBody()
                .next()
                .flatMap(body -> {
                    try {
                        final Conta conta = mapper.readValue(body.asInputStream(), Conta.class);

                        return Mono.just(
                                new UsernamePasswordAuthenticationToken(
                                        conta.getUsername(),
                                        conta.getPassword()
                                )
                        );
                    } catch (IOException e) {
                        return Mono.error(new RuntimeException("Error while parsing credentials"));
                    }
                });
    }

    /**
     * @return ServerSecurityContextRepository
     */
    @Bean
    public ServerSecurityContextRepository securityContextRepository() {

        final WebSessionServerSecurityContextRepository securityContextRepository = new WebSessionServerSecurityContextRepository();

//        securityContextRepository.setSpringSecurityContextAttrName("spring-security-context");
        return securityContextRepository;
    }

    /**
     * @param httpSecurity ServerHttpSecurity
     * @return SecurityWebFilterChain
     */
    @Bean
    public SecurityWebFilterChain securityWebFiltersOrder(final ServerHttpSecurity httpSecurity) {
        return httpSecurity
                .csrf().disable()
                .httpBasic().disable()
                .formLogin().disable()
                .logout().disable()
                .securityContextRepository(securityContextRepository())
                .authorizeExchange()
                .anyExchange().permitAll()
                .and()
                .addFilterAt(authenticationWebFilter(), SecurityWebFiltersOrder.AUTHENTICATION)
                .addFilterAt(logoutWebFilter(), SecurityWebFiltersOrder.LOGOUT)
                .build();
    }

    /**
     * @return {AuthenticationWebFilter}
     */
    private AuthenticationWebFilter authenticationWebFilter() {
        final AuthenticationWebFilter filter = new AuthenticationWebFilter(reactiveAuthenticationManager);

        filter.setSecurityContextRepository(securityContextRepository());
        filter.setAuthenticationConverter(jsonBodyAuthenticationConverter(this.objectMapper));
        filter.setAuthenticationSuccessHandler(this.serverAuthenticationSuccessHandler);
        filter.setAuthenticationFailureHandler(this.serverAuthenticationFailureHandler);
        filter.setRequiresAuthenticationMatcher(
                ServerWebExchangeMatchers.pathMatchers(HttpMethod.POST, "/login", "/sistema/login", "/sistema/mobile/login")
        );

        return filter;
    }

    /**
     * @return {LogoutWebFilter}
     */
    private LogoutWebFilter logoutWebFilter() {
        final LogoutWebFilter logoutWebFilter = new LogoutWebFilter();

        final SecurityContextServerLogoutHandler logoutHandler = new SecurityContextServerLogoutHandler();
        logoutHandler.setSecurityContextRepository(securityContextRepository());

        logoutWebFilter.setLogoutHandler(logoutHandler);
        logoutWebFilter.setLogoutSuccessHandler(serverLogoutSuccessHandler);
        logoutWebFilter.setRequiresLogoutMatcher(
                ServerWebExchangeMatchers.pathMatchers(HttpMethod.GET, "/logout", "/sistema/logout", "/sistema/mobile/logout")
        );

        return logoutWebFilter;
    }

}