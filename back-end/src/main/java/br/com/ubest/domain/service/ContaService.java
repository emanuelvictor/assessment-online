package br.com.ubest.domain.service;

import br.com.ubest.domain.entity.usuario.Conta;
import br.com.ubest.domain.repository.ContaRepository;
import br.com.ubest.infrastructure.tenant.TenantDetails;
import br.com.ubest.infrastructure.tenant.TenantDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.stream.Collectors;

import static br.com.ubest.Application.SCHEMA_NAME;

@Service
@RequiredArgsConstructor
public class ContaService implements TenantDetailsService {

    /**
     *
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
     * @param username {String}
     * @return {TenantDetails}
     */
    public TenantDetails findTenantDetailsByUsername(final String username) {
        final Conta conta = contaRepository.findByEmailIgnoreCase(username.toLowerCase());

        Assert.notNull(conta, "Cliente não encontrado");

        return contaRepository.findByEmailIgnoreCase(username.toLowerCase());
    }

    /**
     * @param sessionId {String}
     * @return {TenantDetails}
     */
    @Override
    public TenantDetails findTenantDetailsBySessionId(final String sessionId) {
        return null;
    }

    /**
     * @param email {String}
     * @return Mono<UserDetails>
     */
    public Mono<UserDetails> findUsuarioByEmail(final String email) {

        final Conta conta = contaRepository.findByEmailIgnoreCase(email.toLowerCase());

        Assert.notNull(conta, "Conta não encontrada");

        return Mono.just(contaRepository.findByEmailIgnoreCase(email.toLowerCase()));
    }

    /**
     * @return Iterable<String>
     */
    @Override
    public Iterable<String> getAllTenants() {
        return this.contaRepository.listClientesByFilters(null, null).getContent().stream().map(Conta::getEsquema).collect(Collectors.toList());
    }

//    /**
//     * @param defaultFilter String
//     * @param pageable      Pageable
//     * @return Page<Conta>
//     */
//    public Page<Conta> listByFilters(final String defaultFilter, final Pageable pageable) {
//        return contaRepository.listByFilters(defaultFilter, pageable);
//    }

    /**
     * @param defaultFilter defaultFilter
     * @param pageable      Pageable
     * @return Page<Conta>
     */
    public Page<Conta> listClientesByFilters(final String defaultFilter, final Pageable pageable) {
        return contaRepository.listClientesByFilters(defaultFilter, pageable);
    }

    /**
     * @param schema String
     * @return boolean
     */
    public Mono<Boolean> acceptScheme(final ServerWebExchange exchange, final String schema) {
        return exchange.getSession()
                .doOnNext(webSession -> webSession.getAttributes().put(SCHEMA_NAME, schema))
                .map(webSession -> true);
    }
}
