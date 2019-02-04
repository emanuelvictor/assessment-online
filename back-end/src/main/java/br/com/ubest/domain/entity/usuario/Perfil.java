package br.com.ubest.domain.entity.usuario;

import org.springframework.security.core.GrantedAuthority;

import java.util.HashSet;
import java.util.Set;

public enum Perfil implements GrantedAuthority {

    ADMINISTRADOR, // 0
    OPERADOR, // 1
    ATENDENTE, // 2
    ANONYMOUS, // 3
    ROOT; // 4

    public static final String ADMINISTRADOR_VALUE = "ADMINISTRADOR";
    public static final String OPERADOR_VALUE = "OPERADOR";
    public static final String ATENDENTE_VALUE = "ATENDENTE";
    public static final String ANONYMOUS_VALUE = "ANONYMOUS";
    public static final String ROOT_VALUE = "ROOT";

    /*
     * (non-Javadoc)
     *
     * @see org.springframework.security.core.GrantedAuthority#getAuthority()
     */
    @Override
    public String getAuthority() {
        return this.name();
    }

    /**
     * @return
     */
    public Set<GrantedAuthority> getAuthorities() {
        final Set<GrantedAuthority> authorities = new HashSet<>();

        authorities.add(this);

        authorities.add(Perfil.OPERADOR);

        return authorities;
    }
}
