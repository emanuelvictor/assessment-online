package br.com.assessment.domain.service;

import br.com.assessment.domain.entity.usuario.Conta;
import br.com.assessment.domain.repository.ContaRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import reactor.core.publisher.Mono;

import java.util.function.Supplier;

@Service
@Transactional
@AllArgsConstructor
public class ContaService implements ReactiveUserDetailsService {

    /**
     * 
     */
    private final ContaRepository contaRepository;

    /**
     *
     * @param email {String}
     * @return Mono<UserDetails>
     */
    public Mono<UserDetails> findByUsername(final String email) {
        return this.findUsuarioByEmail(email);
    }

    /**
     *
     * @param email {String}
     * @return Mono<UserDetails>
     */
    public Mono<UserDetails> findUsuarioByEmail(final String email) {
        if (email.equals(Conta.MASTER_USER_EMAIL)) {
            return Mono.just(Conta.getMasterAccount());
        }

        final Conta conta = contaRepository.findByEmail(email);

        Assert.notNull(conta, "Conta não encontrada");

        return Mono.just(conta);

    }

}