package br.com.ubest.domain.entity.usuario;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
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

import static br.com.ubest.application.context.LocalContext.DEFAULT_TENANT_ID;


@Data
@Entity
@Audited
@Table(schema = DEFAULT_TENANT_ID)
@lombok.EqualsAndHashCode(callSuper = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.UUIDGenerator.class)
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
    @OneToOne(mappedBy = "conta", optional = false, fetch = FetchType.EAGER)
    private Usuario usuario;

    /**
     *
     */
    public Conta() {
    }

    /**
     *
     * @param id long
     * @param administrador boolean
     * @param root boolean
     * @param esquema String
     * @param email String
     * @param password String
     * @param lastLogin LocalDateTime
     * @param usuario Usuario
     */
    public Conta(final long id, final @NotNull boolean administrador,
                 @NotNull final boolean root, @NotNull final String esquema,
                 @Email final String email, final String password, final LocalDateTime lastLogin, final Usuario usuario) {
        this.id = id;
        this.administrador = administrador;
        this.root = root;
        this.esquema = esquema;
        this.email = email;
        this.password = password;
        this.lastLogin = lastLogin;
        this.usuario = usuario;
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
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {

        final Set<Perfil> authorities = new HashSet<>();

        authorities.add(Perfil.ATENDENTE);

        if (getIsOperador())
            authorities.add(Perfil.OPERADOR);

        if (this.getIsAdministrador()) {
            authorities.add(Perfil.ADMINISTRADOR);
            authorities.add(Perfil.OPERADOR);
        }

        if (this.getIsRoot()) {
            authorities.add(Perfil.ADMINISTRADOR);
            authorities.add(Perfil.OPERADOR);
            authorities.add(Perfil.ROOT);
        }

        return authorities;
    }

    /**
     * @return Perfil
     */
    public Perfil getPerfil() {

        if (this.isRoot())
            return Perfil.ROOT;

        else if (this.isAdministrador())
            return Perfil.ADMINISTRADOR;

        else if (this.getIsOperador())
            return Perfil.OPERADOR;

        else
            return Perfil.ATENDENTE;

    }

    /**
     *
     */
    @Override
    public boolean isEnabled() {
        return true;
    }

    /**
     * @return boolean
     */
    public boolean getIsRoot() {
        return root;
    }

    /**
     * @return boolean
     */
    public boolean getIsAdministrador() {
        return administrador;
    }

    /**
     * @return boolean
     */
    public boolean getIsOperador() {
        return this.usuario != null && this.usuario.isOperador();
    }

    /**
     * @return String
     */
    public String getEmail() {
        return email != null ? email.toLowerCase() : null;
    }

    /**
     * @param email String
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
