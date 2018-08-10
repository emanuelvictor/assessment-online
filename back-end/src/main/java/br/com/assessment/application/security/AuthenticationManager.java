package br.com.assessment.application.security;


import br.com.assessment.domain.entity.usuario.Conta;
import lombok.AllArgsConstructor;
import org.flywaydb.core.Flyway;
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

    private final PasswordEncoder passwordEncoder;

    private final Flyway flyway;

    @Override
    public Mono<Authentication> authenticate(Authentication authentication) {
        final String username = authentication.getName();

        return this.userDetailsService.findByUsername(username)
                .publishOn(Schedulers.parallel())
                .filter(u -> this.passwordEncoder.matches((String) authentication.getCredentials(), u.getPassword()))
                .switchIfEmpty(Mono.defer(() -> Mono.error(new BadCredentialsException("Invalid Credentials"))))
                .map(u -> {
                    final Conta conta = (Conta) u;

                    final String schema = conta.getEsquema();
//        final Flyway flyway = new Flyway();
//        flyway.setLocations("db/migration");
//        flyway.setDataSource(dataSource);
                    flyway.setSchemas(schema);
//        flyway.setPlaceholderPrefix("v");
                    flyway.migrate();

                    return new UsernamePasswordAuthenticationToken(u, u.getPassword(), u.getAuthorities());
                });
    }

}

