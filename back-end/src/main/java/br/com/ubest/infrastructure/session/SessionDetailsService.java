package br.com.ubest.infrastructure.session;

public interface SessionDetailsService {

    SessionDetails findByToken(final String token);

    SessionDetails save(final SessionDetails sessionDetails);

}
