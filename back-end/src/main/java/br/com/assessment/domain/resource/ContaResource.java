package br.com.assessment.domain.resource;

import br.com.assessment.domain.entity.usuario.Conta;
import br.com.assessment.domain.service.ContaService;
import lombok.AllArgsConstructor;
import org.flywaydb.core.Flyway;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/contas")
@AllArgsConstructor
public class ContaResource {

    private final ContaService contaService;

    /**
     *
     * @param email {String}
     * @return Mono<UserDetails>
     */
    @GetMapping(params = "email")
    public Mono<UserDetails> findUsuarioByEmail(@RequestParam final String email) {
        return this.contaService.findUsuarioByEmail(email);
    }

    /**
     *
     * @param conta Conta
     * @return Mono<Conta>
     */
    @PostMapping
    @Transactional
    public Mono<Conta> createAccount(@RequestBody Conta conta){
        return this.contaService.createAccount(conta);
    }


}