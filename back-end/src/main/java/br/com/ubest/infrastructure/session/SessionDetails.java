package br.com.ubest.infrastructure.session;

public interface SessionDetails {

    void setUsername(final String username);

    String getUsername();

    boolean validate();

    void generateToken();

    String getToken();

}
