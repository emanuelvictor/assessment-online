package br.com.assessment.application.configuration;

import br.com.assessment.application.multitenancy.TenantContext;
import br.com.assessment.application.security.AuthenticationFailureHandler;
import br.com.assessment.application.security.AuthenticationSuccessHandler;
import br.com.assessment.domain.service.ContaService;
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
    private final ContaService contaService;

    /**
     *
     * @param httpSecurity {ServerHttpSecurity}
     * @return {SecurityWebFilterChain}
     * @throws Exception {}
     */
    @Bean
    SecurityWebFilterChain springWebFilterChain(ServerHttpSecurity httpSecurity) throws Exception {

        return httpSecurity
                .authenticationManager(authentication -> {
                    TenantContext.setCurrentTenant((String) authentication.getPrincipal());
                    return userDetailsRepositoryReactiveAuthenticationManager().authenticate(authentication);
                })
                .authorizeExchange()
                .anyExchange().permitAll()
                .and()
                .csrf().disable()
                .formLogin()
                .requiresAuthenticationMatcher(exchange -> ServerWebExchangeMatcher.MatchResult.match())
                .authenticationSuccessHandler(authenticationSuccessHandler)
                .authenticationFailureHandler(authenticationFailureHandler)
                .and()
                .build();

    }

    @Bean
    UserDetailsRepositoryReactiveAuthenticationManager userDetailsRepositoryReactiveAuthenticationManager() {
        final UserDetailsRepositoryReactiveAuthenticationManager userDetailsRepositoryReactiveAuthenticationManager = new UserDetailsRepositoryReactiveAuthenticationManager(this.reactiveUserDetailsService());
        userDetailsRepositoryReactiveAuthenticationManager.setPasswordEncoder(this.passwordEncoder());
        return userDetailsRepositoryReactiveAuthenticationManager;
    }

    /**
     */
    @Bean
    ReactiveUserDetailsService reactiveUserDetailsService() {
        return contaService;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}