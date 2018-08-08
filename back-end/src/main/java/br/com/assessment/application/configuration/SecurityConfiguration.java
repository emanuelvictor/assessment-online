package br.com.assessment.application.configuration;

import br.com.assessment.application.handlers.AuthenticationFailureHandler;
import br.com.assessment.application.handlers.AuthenticationSuccessHandler;
import br.com.assessment.domain.entity.usuario.Conta;
import br.com.assessment.domain.service.ContaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UserDetailsRepositoryReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.security.web.server.authentication.logout.LogoutWebFilter;
import org.springframework.security.web.server.authentication.logout.RedirectServerLogoutSuccessHandler;
import org.springframework.security.web.server.authentication.logout.SecurityContextServerLogoutHandler;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.security.web.server.context.WebSessionServerSecurityContextRepository;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.net.URI;
import java.util.function.Function;

@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
@AllArgsConstructor
public class SecurityConfiguration {



    private final ContaService userDetailsService;

    private final ObjectMapper mapper;

    /**
     *
     */
    private final AuthenticationSuccessHandler authenticationSuccessHandler;

    /**
     *
     */
    private final AuthenticationFailureHandler authenticationFailureHandler;


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(31);
    }

    @Bean
    public ServerSecurityContextRepository securityContextRepository() {
        WebSessionServerSecurityContextRepository securityContextRepository =
                new WebSessionServerSecurityContextRepository();

        securityContextRepository.setSpringSecurityContextAttrName("langdope-security-context");

        return securityContextRepository;
    }

    @Bean
    public ReactiveAuthenticationManager authenticationManager() {
        UserDetailsRepositoryReactiveAuthenticationManager authenticationManager =
                new UserDetailsRepositoryReactiveAuthenticationManager(userDetailsService);

        authenticationManager.setPasswordEncoder(passwordEncoder());

        return authenticationManager;
    }

    @Bean
    public SecurityWebFilterChain securityWebFiltersOrder(ServerHttpSecurity httpSecurity) {
        return httpSecurity
                .csrf().disable()
                .httpBasic().disable()
                .formLogin().disable()
                .logout().disable()
                .securityContextRepository(securityContextRepository())
                .authorizeExchange()
                .anyExchange().permitAll() // Currently
                .and()
                .addFilterAt(authenticationWebFilter(), SecurityWebFiltersOrder.AUTHENTICATION)
                .addFilterAt(logoutWebFilter(), SecurityWebFiltersOrder.LOGOUT)
                .build();
    }

    private AuthenticationWebFilter authenticationWebFilter() {
        AuthenticationWebFilter filter = new AuthenticationWebFilter(authenticationManager());

        filter.setSecurityContextRepository(securityContextRepository());
        filter.setAuthenticationConverter(jsonBodyAuthenticationConverter());
        filter.setAuthenticationSuccessHandler(this.authenticationSuccessHandler);
        filter.setAuthenticationFailureHandler(authenticationFailureHandler);
        filter.setRequiresAuthenticationMatcher(
                ServerWebExchangeMatchers.pathMatchers(HttpMethod.POST, "/login")
        );

        return filter;
    }

    private LogoutWebFilter logoutWebFilter() {
        LogoutWebFilter logoutWebFilter = new LogoutWebFilter();

        SecurityContextServerLogoutHandler logoutHandler = new SecurityContextServerLogoutHandler();
        logoutHandler.setSecurityContextRepository(securityContextRepository());

        RedirectServerLogoutSuccessHandler logoutSuccessHandler = new RedirectServerLogoutSuccessHandler();
        logoutSuccessHandler.setLogoutSuccessUrl(URI.create("/"));

        logoutWebFilter.setLogoutHandler(logoutHandler);
        logoutWebFilter.setLogoutSuccessHandler(logoutSuccessHandler);
        logoutWebFilter.setRequiresLogoutMatcher(
                ServerWebExchangeMatchers.pathMatchers(HttpMethod.GET, "/logout")
        );

        return logoutWebFilter;
    }

    private Function<ServerWebExchange, Mono<Authentication>> jsonBodyAuthenticationConverter() {
        return exchange -> exchange
                .getRequest()
                .getBody()
                .next()
                .flatMap(body -> {
                    try {
                        final Conta signInForm =
                                mapper.readValue(body.asInputStream(), Conta.class);

                        return Mono.just(
                                new UsernamePasswordAuthenticationToken(
                                        signInForm.getUsername(),
                                        signInForm.getPassword()
                                )
                        );
                    } catch (IOException e) {
                        return Mono.error(new RuntimeException("Error while parsing credentials"));
                    }
                });
    }

}