package br.com.ubest.application.resource;

import br.com.ubest.domain.entity.unidade.Dispositivo;
import br.com.ubest.domain.entity.usuario.Conta;
import br.com.ubest.domain.repository.ContaRepository;
import br.com.ubest.domain.service.DispositivoService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
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
     *
     */
    private final DispositivoService dispositivoService;

    /**
     * TODO verificar se não da pra colocar em outro lugar também
     *
     * @return Mono<Optional < Object>>
     */
    @GetMapping
    public Mono<Optional<Object>> principal() {
        return ReactiveSecurityContextHolder.getContext().map(SecurityContext::getAuthentication).switchIfEmpty(Mono.empty()).map(authentication -> {

            if (authentication.getPrincipal() instanceof Conta) {
                final Conta conta = (Conta) authentication.getPrincipal();
                return Optional.ofNullable(contaRepository.findByEmailIgnoreCase(conta.getEmail()));
            } else {
                final Dispositivo dispositivo = dispositivoService.getDispositivo(((Dispositivo) authentication.getPrincipal()).getId());
                return Optional.ofNullable(dispositivo);
            }

        });
    }
}