package br.com.ubest.infrastructure.session;

import org.springframework.session.Session;

public interface SessionDetails extends Session {

    void setUsername(final String username);

    String getUsername();

}
