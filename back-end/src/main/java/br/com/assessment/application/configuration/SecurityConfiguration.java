package br.com.assessment.application.configuration;

import br.com.assessment.application.multitenancy.TenantContext;
import br.com.assessment.application.security.AuthenticationFailureHandler;
import br.com.assessment.application.security.AuthenticationSuccessHandler;
import br.com.assessment.domain.service.UsuarioService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UserDetailsRepositoryReactiveAuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatcher;

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
    private final UsuarioService usuarioService;

    /**
     */
    @Bean
    SecurityWebFilterChain springWebFilterChain(ServerHttpSecurity httpSecurity) throws Exception {

        return httpSecurity
                .authenticationManager(authentication -> {
                    TenantContext.setCurrentTenant(authentication.getName());
                    return userDetailsRepositoryReactiveAuthenticationManager().authenticate(authentication);
                })
                .authorizeExchange()
                .anyExchange().permitAll()
                .and()
                .csrf().disable()
                .formLogin()
                .requiresAuthenticationMatcher(exchange -> {
                    final Map map = new HashMap<>();
//                    map.put("login", "login");
//                    map.put("principal", "principal");
                    return ServerWebExchangeMatcher.MatchResult.match();
                })
                .authenticationSuccessHandler(authenticationSuccessHandler)
                .authenticationFailureHandler(authenticationFailureHandler)
//                todo IMPLEMENTAR logout, remover o tenant .and().logout().logoutHandler(new ServerLogoutHandler() {
//                    @Override
//                    public Mono<Void> logout(WebFilterExchange webFilterExchange, Authentication authentication) {
//                        return null;
//                    }
//                })
                .and()
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
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}