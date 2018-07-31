package br.com.assessment.application.configuration;

import br.com.assessment.application.multitenancy.TenantFilter;
import br.com.assessment.application.security.AuthenticationFailureHandler;
import br.com.assessment.application.security.AuthenticationSuccessHandler;
import br.com.assessment.domain.service.UsuarioService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.WebFilterExchange;
import org.springframework.security.web.server.authentication.logout.ServerLogoutHandler;
import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
@AllArgsConstructor
public class SecurityConfiguration {

    /**
     *
     */
    private final UsuarioService usuarioService;

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
     */
    @Bean
    SecurityWebFilterChain springWebFilterChain(ServerHttpSecurity httpSecurity) throws Exception {

        return httpSecurity
                .authorizeExchange()
                .anyExchange().permitAll()
                .and()
                .csrf().disable()
                .formLogin()
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

    /**
     */
    @Bean
    ReactiveUserDetailsService userDetailsService() {
        return usuarioService::findByUsername;
    }

}