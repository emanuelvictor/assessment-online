package br.com.ubest.infrastructure.session;

public interface SessionDetailsService {

    SessionDetails findByToken(final String token);

    void destroySession(final String token);

    SessionDetails createSession(final String username);

    SessionDetails createSession(final String username, final String token);
}
