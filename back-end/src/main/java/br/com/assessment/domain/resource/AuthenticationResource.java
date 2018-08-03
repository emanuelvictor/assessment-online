package br.com.assessment.domain.resource;

import br.com.assessment.domain.entity.usuario.Usuario;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/principal")
public class AuthenticationResource {

    @GetMapping
    public Mono<Usuario> principal() {
        return ReactiveSecurityContextHolder.getContext().map(SecurityContext::getAuthentication).switchIfEmpty(Mono.empty()).map(authentication -> (Usuario) authentication.getPrincipal());
    }
}