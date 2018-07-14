package br.com.assessment.application.configuration;

import br.com.assessment.application.security.AuthenticationSuccessHandler;
import br.com.assessment.domain.service.UsuarioService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
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
     */
    public SecurityConfiguration(final UsuarioService usuarioService, final AuthenticationSuccessHandler authenticationSuccessHandler) {
        this.usuarioService = usuarioService;
        this.authenticationSuccessHandler = authenticationSuccessHandler;
    }

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
                .and()
                .build();

    }

    /**
     */
    @Bean
    ReactiveUserDetailsService userDetailsService() {
        return usuarioService::findByUsername;
    }

}