package br.com.ubest.infrastructure.session;

public interface SessionDetailsService {

    SessionDetails findByToken(final String token);

    SessionDetails createSessionByUsername(final String username);
}
