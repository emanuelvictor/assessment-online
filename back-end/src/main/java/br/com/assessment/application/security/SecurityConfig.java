package br.com.assessment.application.security;

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
public class SecurityConfig {

    private final UsuarioService usuarioService;

    public SecurityConfig(final UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @Bean
    SecurityWebFilterChain springWebFilterChain(ServerHttpSecurity http) throws Exception {
        return http
                .authorizeExchange()
//                .anyExchange().permitAll()
                .anyExchange().authenticated()
                .and()
                .csrf().disable()
                .formLogin()
                .and()
                .build();
    }

    @Bean
    ReactiveUserDetailsService userDetailsService() {
        return usuarioService::findByUsername;
    }

}