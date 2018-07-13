package br.com.assessment.application.configuration;

import br.com.assessment.application.security.AuthenticationFailureHandler;
import br.com.assessment.application.security.AuthenticationSuccessHandler;
import br.com.assessment.domain.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebExceptionHandler;
import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class SecurityConfig {

    private final UsuarioService usuarioService;

//    /**
//     *
//     */
//    @Autowired
//    private AuthenticationFailureHandler authenticationFailureHandler;

    /**
     *
     */
    private final AuthenticationSuccessHandler authenticationSuccessHandler;

    public SecurityConfig(final UsuarioService usuarioService, final AuthenticationSuccessHandler authenticationSuccessHandler) {
        this.usuarioService = usuarioService;
        this.authenticationSuccessHandler = authenticationSuccessHandler;
    }

    @Bean
    SecurityWebFilterChain springWebFilterChain(ServerHttpSecurity httpSecurity) throws Exception {
//        return httpSecurity
//                .csrf().disable()
//                .headers().frameOptions().disable().and()
//                .authorizeExchange() //todo
////.anyExchange()
////                .authenticated()
//                .and()
//                .formLogin()
//                .authenticationSuccessHandler(authenticationSuccessHandler)
////                .authenticationFailureHandler(authenticationFailureHandler)
//                .and().logout().logoutUrl("/logout")
////                .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler());;
//                .and().build();

        return httpSecurity
                .authorizeExchange()
                .anyExchange().permitAll()
//                .anyExchange().authenticated()
                .and()
                .csrf().disable()
                .formLogin()
                .authenticationSuccessHandler(authenticationSuccessHandler)
                .and()
                .build();

    }

    @Bean
    ReactiveUserDetailsService userDetailsService() {
        return usuarioService::findByUsername;
    }

}