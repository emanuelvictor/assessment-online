package br.com.assessment.domain.service;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.security.Principal;

@Service
@Transactional
public class AuthenticationService {

    public Mono<Object> principal(Principal principal) {
        if (principal != null && ((UsernamePasswordAuthenticationToken) principal).getPrincipal() != null)
            return Mono.just(((UsernamePasswordAuthenticationToken) principal).getPrincipal());
        return Mono.empty();
    }

}