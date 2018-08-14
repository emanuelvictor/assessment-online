package br.com.assessment.domain.entity.usuario;

import br.com.assessment.domain.entity.generic.AbstractEntity;
import lombok.Data;
import org.hibernate.envers.Audited;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import static br.com.assessment.application.multitenancy.TenantIdentifierResolver.DEFAULT_TENANT_ID;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
@Table(schema = DEFAULT_TENANT_ID)
public class Conta extends AbstractEntity implements UserDetails {

    /**
     *
     */
    @NotNull
    private boolean administrador;

    /**
     *
     */
    @NotNull
    private boolean root;

    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    private String esquema;

    /**
     *
     */
    @Email
    @Column(unique = true)
    private String email;

    /**
     *
     */
    private String password;

    /**
     *
     */
    private LocalDateTime lastLogin;

    /**
     *
     */
    @OneToOne(mappedBy = "conta", fetch = FetchType.EAGER, optional = false)
    private Usuario usuario;

    /**
     *
     */
    public Conta() {
    }

    /**
     *
     */
    public Conta(final String schema) {
        this.setEsquema(schema);
    }


    /**
     * (non-Javadoc)
     *
     * @see org.springframework.security.core.userdetails.UserDetails#getPassword()
     */
    @Override
    public String getPassword() {
        return this.password;
    }

    /**
     * (non-Javadoc)
     *
     * @see org.springframework.security.core.userdetails.UserDetails#getUsername()
     */
    @Override
    @Transient
    public String getUsername() {
        return this.email;
    }


    /**
     *
     */
    @Override
    @Transient
    public Collection<? extends GrantedAuthority> getAuthorities() {

        final Set<GrantedAuthority> authorities = new HashSet<>();

        authorities.add((GrantedAuthority) () -> "ROLE_ATENDENTE");

        if (this.usuario != null && this.usuario.isOperador())
            authorities.add((GrantedAuthority) () -> "ROLE_OPERADOR");

        if (this.getIsAdministrador()) {
            authorities.add((GrantedAuthority) () -> "ROLE_ADMINISTRADOR");
            authorities.add((GrantedAuthority) () -> "ROLE_OPERADOR");
        }

        return authorities;
    }

    /**
     *
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Tratamento para quando a conta estiver bloqueada, a data de hoje deve estar entra a data de desbloqueio e a data de bloqueio
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     */
    @Override
    public boolean isEnabled() {
        return true;
    }

    /**
     * @return boolean
     */
    public boolean getIsAdministrador() {
        return administrador;
    }

}
