package br.com.assessment.domain.entity.usuario;

import br.com.assessment.application.multitenancy.TenantIdentifierResolver;
import br.com.assessment.domain.entity.generic.AbstractEntity;
import lombok.Data;
import org.hibernate.envers.Audited;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

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
     * Senha do usuário master
     */
    public static final String MASTER_USER_PASSWORD = "bm129000";

    /**
     * Usuário master
     */
    public static final String MASTER_USER_EMAIL = "admin@admin.com";

    /**
     * Nome do usuário master
     */
    public static final String MASTER_USER_NAME = "Administrador";

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
    @OneToOne(fetch = FetchType.LAZY, optional = false)
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

        if (this.usuario != null && this.getIsAdministrador())
            authorities.add((GrantedAuthority) () -> "ROLE_ADMINISTRADOR");

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
     *
     * @return
     */
    public boolean getIsAdministrador() {
        return administrador;
    }

    /**
     * Retorna a instância de um usuário master
     */
    public static UserDetails getMasterAccount() {

        final Usuario usuario = new Usuario();
        usuario.setNome(MASTER_USER_NAME);
        usuario.setId(1L);

        final Conta conta = new Conta(DEFAULT_TENANT_ID);
//        final Conta conta = new Conta(MASTER_USER_EMAIL);
        conta.setId(1L);
        conta.setAdministrador(true);
        conta.setEmail(MASTER_USER_EMAIL);
        conta.setPassword(new BCryptPasswordEncoder().encode(MASTER_USER_PASSWORD));
        conta.setUsuario(usuario);

        return conta;

    }

}
