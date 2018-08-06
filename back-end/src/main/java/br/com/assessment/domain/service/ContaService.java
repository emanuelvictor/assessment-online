package br.com.assessment.domain.service;

import br.com.assessment.domain.entity.usuario.Conta;
import br.com.assessment.domain.repository.ContaRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

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
        return Mono.just(contaRepository.findByEmail(email));
    }

}