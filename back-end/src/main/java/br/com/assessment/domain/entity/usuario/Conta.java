package br.com.assessment.domain.entity.usuario;

import br.com.assessment.domain.entity.generic.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
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

import static br.com.assessment.application.multitenancy.Context.DEFAULT_TENANT_ID;


@Data
@Entity
@Audited
@Table(schema = DEFAULT_TENANT_ID)
@lombok.EqualsAndHashCode(callSuper = true)
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

    /**
     * @return
     */
    public String getEmail() {
        return email != null ? email.toLowerCase() : null;
    }

    /**
     * @param email
     */
    public void setEmail(String email) {
        this.email = email != null ? email.toLowerCase() : null;
    }


    /**
     * (non-Javadoc)
     *
     * @see org.springframework.security.core.userdetails.UserDetails#getPassword()
     */
    @JsonIgnore
    public String getPassword() {
        return password;
    }

    @JsonProperty
    public void setPassword(String password) {
        this.password = password;
    }

    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }
}
