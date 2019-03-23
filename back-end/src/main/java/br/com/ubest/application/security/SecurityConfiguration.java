package br.com.ubest.application.security;

import br.com.ubest.Application;
import br.com.ubest.domain.entity.usuario.Conta;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
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
import org.springframework.session.data.redis.config.annotation.web.server.EnableRedisWebSession;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.session.CookieWebSessionIdResolver;
import org.springframework.web.server.session.WebSessionIdResolver;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.time.Duration;
import java.util.function.Function;

@Configuration
@EnableWebFluxSecurity
@RequiredArgsConstructor
@EnableReactiveMethodSecurity
@EnableRedisWebSession(maxInactiveIntervalInSeconds = SecurityConfiguration.TIMEOUT_SESSION)
public class SecurityConfiguration {

    /**
     *
     */
    static final int TIMEOUT_SESSION = 2592000;

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

    /**
     *
     */
    private final ServerSecurityContextRepository securityContextRepository;



    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory();
    }

    /**
     * @return WebSessionIdResolver
     */
    @Bean
    public WebSessionIdResolver webSessionIdResolver() {
        final CookieWebSessionIdResolver resolver = new CookieWebSessionIdResolver();
        resolver.setCookieName(Application.TOKEN_NAME);
        resolver.addCookieInitializer(responseCookieBuilder -> {
            responseCookieBuilder.httpOnly(false);
            responseCookieBuilder.maxAge(Duration.ofDays(999999999));
        });
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
                .securityContextRepository(securityContextRepository)
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

        filter.setSecurityContextRepository(securityContextRepository);
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
        logoutHandler.setSecurityContextRepository(securityContextRepository);

        logoutWebFilter.setLogoutHandler(logoutHandler);
        logoutWebFilter.setLogoutSuccessHandler(serverLogoutSuccessHandler);
        logoutWebFilter.setRequiresLogoutMatcher(
                ServerWebExchangeMatchers.pathMatchers(HttpMethod.GET, "/logout", "/sistema/logout", "/sistema/mobile/logout")
        );

        return logoutWebFilter;
    }

}
