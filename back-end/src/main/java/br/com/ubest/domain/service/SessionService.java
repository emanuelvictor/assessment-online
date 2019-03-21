package br.com.ubest.domain.service;

import br.com.ubest.domain.entity.usuario.Sessao;
import br.com.ubest.domain.repository.SessaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.session.ReactiveSessionRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;


@Service
@RequiredArgsConstructor
public class SessionService implements ReactiveSessionRepository<Sessao> {

    private final SessaoRepository sessaoRepository;

    @Override
    public Mono<Sessao> createSession() {
        return Mono.defer(() -> Mono.just(new Sessao()));
    }

    @Override
    public Mono<Void> save(final Sessao sessao) {
        if (sessao.getUsername() == null)
            return this.deleteById(sessao.getId());
        return Mono.fromRunnable(() ->
                this.sessaoRepository.save(sessao)
        );
    }

    @Override
    public Mono<Sessao> findById(final String id) {
        return Mono.defer(() -> Mono.justOrEmpty(this.sessaoRepository.findById(id).orElse(null)));
    }

    @Override
    public Mono<Void> deleteById(final String id) {
        return this.findById(id).flatMap(sessao -> {
            this.sessaoRepository.deleteById(sessao.getId());
            return Mono.empty();
        });
    }
}
