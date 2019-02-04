package br.com.ubest.domain.service;

import br.com.ubest.application.context.LocalContext;
import br.com.ubest.domain.entity.usuario.Conta;
import br.com.ubest.domain.repository.ContaRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import reactor.core.publisher.Mono;

@Service
@AllArgsConstructor
public class ContaService implements ReactiveUserDetailsService {

    /**
     * TODO refazer tudo isso
     */
    private final ContaRepository contaRepository;

    /**
     * @param email {String}
     * @return Mono<UserDetails>
     */
    public Mono<UserDetails> findByUsername(final String email) {
        return this.findUsuarioByEmail(email);
    }

    /**
     * @param email {String}
     * @return Mono<UserDetails>
     */
    public Mono<UserDetails> findUsuarioByEmail(final String email) {

        final Conta conta = contaRepository.findByEmailIgnoreCase(email.toLowerCase());

        Assert.notNull(conta, "Conta não encontrada");

        LocalContext.setCurrentSchema(conta.getEsquema());

        return Mono.just(contaRepository.findByEmailIgnoreCase(email.toLowerCase())); // TODO???

    }

}
