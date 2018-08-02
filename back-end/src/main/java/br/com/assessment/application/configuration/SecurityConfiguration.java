package br.com.assessment.application.configuration;

import br.com.assessment.application.multitenancy.TenantContext;
import br.com.assessment.application.multitenancy.TenantFilter;
import br.com.assessment.application.security.AuthenticationFailureHandler;
import br.com.assessment.application.security.AuthenticationSuccessHandler;
import br.com.assessment.domain.service.UsuarioService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UserDetailsRepositoryReactiveAuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.*;
import org.springframework.security.crypto.scrypt.SCryptPasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatcher;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
@AllArgsConstructor
public class SecurityConfiguration {



    /**
     *
     */
    private final AuthenticationSuccessHandler authenticationSuccessHandler;

    /**
     *
     */
    private final AuthenticationFailureHandler authenticationFailureHandler;

    /**
     *
     */
    private final TenantFilter tenantFilter;

    /**
     *
     */
    private final UsuarioService usuarioService;

    /**
     */
    @Bean
    SecurityWebFilterChain springWebFilterChain(ServerHttpSecurity httpSecurity) throws Exception {

        return httpSecurity
                .authenticationManager(new ReactiveAuthenticationManager() {
                    @Override
                    public Mono<Authentication> authenticate(Authentication authentication) {
                        System.out.println(authentication.getPrincipal());
                        TenantContext.setCurrentTenant(authentication.getName());
                        return userDetailsRepositoryReactiveAuthenticationManager().authenticate(authentication);
                    }
                })
                .authorizeExchange()
                .anyExchange().permitAll()
                .and()
                .csrf().disable()
                .formLogin()
//                .authenticationEntryPoint(new ServerAuthenticationEntryPoint() {
//                    @Override
//                    public Mono<Void> commence(ServerWebExchange exchange, AuthenticationException e) {
////                        System.out.println(exchange.getPrincipal());
//                        return Mono.empty();
//                    }
//                })
                .requiresAuthenticationMatcher(new ServerWebExchangeMatcher() {
                    @Override
                    public Mono<MatchResult> matches(ServerWebExchange exchange) {
                        Map map = new HashMap<>();
                        map.put("login", "login");
                        map.put("principal", "principal");
                        return MatchResult.match(map);
                    }
                })
                .authenticationSuccessHandler(authenticationSuccessHandler)
                .authenticationFailureHandler(authenticationFailureHandler)
//                todo IMPLEMENTAR logout, remover o tenant .and().logout().logoutHandler(new ServerLogoutHandler() {
//                    @Override
//                    public Mono<Void> logout(WebFilterExchange webFilterExchange, Authentication authentication) {
//                        return null;
//                    }
//                })
                .and().addFilterAt(tenantFilter, SecurityWebFiltersOrder.FORM_LOGIN)
                .build();

    }

    @Bean
    UserDetailsRepositoryReactiveAuthenticationManager userDetailsRepositoryReactiveAuthenticationManager(){
        final UserDetailsRepositoryReactiveAuthenticationManager userDetailsRepositoryReactiveAuthenticationManager = new UserDetailsRepositoryReactiveAuthenticationManager(this.reactiveUserDetailsService());
        userDetailsRepositoryReactiveAuthenticationManager.setPasswordEncoder(this.passwordEncoder());
        return userDetailsRepositoryReactiveAuthenticationManager;
    }

    /**
     */
    @Bean
    ReactiveUserDetailsService reactiveUserDetailsService() {
        return usuarioService::findByUsername;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}