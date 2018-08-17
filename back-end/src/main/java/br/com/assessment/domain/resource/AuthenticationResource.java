package br.com.assessment.domain.resource;

import br.com.assessment.domain.entity.usuario.Conta;
import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.repository.ContaRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/principal")
public class AuthenticationResource {

    /**
     *
     */
    private final ContaRepository contaRepository;

    /**
     *
     * @return Mono<Conta>
     */
    @GetMapping
    public Mono<Optional<Conta>> principal() {
        return ReactiveSecurityContextHolder.getContext().map(SecurityContext::getAuthentication).switchIfEmpty(Mono.empty())
                .map(authentication -> {
                    final Conta conta = (Conta) authentication.getPrincipal();
                    return contaRepository.findById(conta.getId());// TODO fazer mesmo essa requisição será?!
                });
    }
}