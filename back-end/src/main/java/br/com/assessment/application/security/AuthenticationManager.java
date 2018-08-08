package br.com.assessment.application.security;


import br.com.assessment.application.multitenancy.TenantContext;
import br.com.assessment.domain.entity.usuario.Conta;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

/**
 * @author Emanuel Victor
 */
@Component
@AllArgsConstructor
public class AuthenticationManager implements ReactiveAuthenticationManager {

    private final ReactiveUserDetailsService userDetailsService;

    @Override
    public Mono<Authentication> authenticate(Authentication authentication) {
        final String username = authentication.getName();

        return this.userDetailsService.findByUsername(username)
                .publishOn(Schedulers.parallel())
                .filter(u -> this.passwordEncoder().matches((String) authentication.getCredentials(), u.getPassword()))
                .switchIfEmpty(Mono.defer(() -> Mono.error(new BadCredentialsException("Invalid Credentials"))))
                .map(u -> {

//                    if (!u.getUsername().equals(Conta.MASTER_USER_EMAIL)) // Seta o esquema 'public' como tenant TODO ACOPLAMENTO
                        TenantContext.setCurrentTenant(u.getUsername());

                    return new UsernamePasswordAuthenticationToken(u, u.getPassword(), u.getAuthorities());
                });
    }

    /**
     * @return PasswordEncoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(31);
    }

}

