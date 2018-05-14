package br.com.assessment.domain.entity.usuario;

import org.springframework.security.core.GrantedAuthority;

import java.util.HashSet;
import java.util.Set;

/**
 * @version 1.0
 * @since 02/06/2014
 */
public enum Profile implements GrantedAuthority {

    ADMINISTRATOR, // 0
    OPERATOR, // 1
    ASSAYING, // 2
    ANONYMOUS; // 3

    public static final String ADMINISTRATOR_VALUE = "ADMINISTRATOR";
    public static final String OPERATOR_VALUE = "OPERATOR";
    public static final String ASSAYING_VALUE = "ASSAYING";
    public static final String ANONYMOUS_VALUE = "ANONYMOUS";

    /*
     * (non-Javadoc)
     * 
     * @see org.springframework.security.core.GrantedAuthority#getAuthority()
     */
    @Override
    public String getAuthority() {
        // todo Descobrir como remover esse prefixo
        return "ROLE_" + this.name();
    }

    /**
     * @return
     */
    public Set<GrantedAuthority> getAuthorities() {
        final Set<GrantedAuthority> authorities = new HashSet<>();

        authorities.add(this);

        authorities.add(Profile.ASSAYING);

        return authorities;
    }

}