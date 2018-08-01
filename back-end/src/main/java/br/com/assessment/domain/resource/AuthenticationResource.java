package br.com.assessment.domain.resource;

import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.service.AuthenticationService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.security.Principal;

@RestController
@RequestMapping("/principal")
public class AuthenticationResource {

    private final AuthenticationService authenticationService;

    public AuthenticationResource(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @GetMapping
    public Mono<Authentication> principal(Principal principal) {

        System.out.println(ReactiveSecurityContextHolder.getContext());
        return ReactiveSecurityContextHolder.getContext().map(SecurityContext::getAuthentication).doOnNext(authentication -> {
            System.out.println(authentication.getPrincipal());
        });
//        return ReactiveSecurityContextHolder.getContext().map(SecurityContext::getAuthentication);//this.authenticationService.principal(principal);
    }

    Usuario getUser(Mono<Principal> mono) {
        return (Usuario) mono.block();
    }
}