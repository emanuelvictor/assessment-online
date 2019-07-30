package br.com.ubest.domain.resource;

import br.com.ubest.domain.entity.usuario.Conta;
import br.com.ubest.domain.repository.ContaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping({"**principal", "**sistema/principal", "**sistema/mobile/principal"})
public class AuthenticationResource {

    /**
     *
     */
    private final ContaRepository contaRepository;

    /**
     * TODO verificar se não da pra colocar em outro lugar também
     *
     * @return Mono<Conta>
     */
    @GetMapping
    @Transactional
    public Mono<Optional<Conta>> principal() {
        return ReactiveSecurityContextHolder.getContext().map(SecurityContext::getAuthentication).switchIfEmpty(Mono.empty())
                .map(authentication -> {
                    final Conta conta = (Conta) authentication.getPrincipal();
                    return Optional.ofNullable(contaRepository.findByEmailIgnoreCase(conta.getEmail()));
                });
    }
}