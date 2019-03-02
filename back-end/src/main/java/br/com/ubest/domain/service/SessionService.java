package br.com.ubest.domain.service;

import br.com.ubest.domain.entity.usuario.Sessao;
import br.com.ubest.domain.repository.SessaoRepository;
import br.com.ubest.infrastructure.session.SessionDetails;
import br.com.ubest.infrastructure.session.SessionDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class SessionService implements SessionDetailsService {

    private final SessaoRepository sessaoRepository;

    @Override
    public SessionDetails findByToken(String token) {
        return sessaoRepository.findByToken(token);
    }

    @Override
    public SessionDetails createSessionByUsername(final String username) {
        final Sessao sessao = new Sessao();
        sessao.setUsername(username);
        sessao.generateToken();
        return sessaoRepository.save(sessao);
    }
}