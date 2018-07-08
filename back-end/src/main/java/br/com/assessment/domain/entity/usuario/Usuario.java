package br.com.assessment.domain.entity.usuario;

import br.com.assessment.domain.entity.colaborador.Colaborador;
import br.com.assessment.domain.entity.colaborador.Vinculo;
import lombok.Data;
import org.hibernate.envers.Audited;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Transient;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.util.*;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
public class Usuario extends Pessoa implements UserDetails {

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
    @Email
    private String email;

    /**
     *
     */
    private String password;

    /**
     *
     */
    @NotNull
    private boolean isAdministrador;

    /**
     *
     */
    @Transient
    @OneToMany(mappedBy = "usuario")
    private List<Colaborador> colaboradores;

    /**
     * // TODO: 10/01/18 alterar para LocalDateTime
     */
    private Calendar lastLogin;

    /**
     *
     */
    public Usuario() {
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

        if (this.isOperador())
            authorities.add((GrantedAuthority) () -> "ROLE_OPERADOR");

        if (this.isAdministrador)
            authorities.add((GrantedAuthority) () -> "ROLE_ADMINISTRADOR");

        return authorities;
    }

    /**
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
        return this.isAdministrador;
    }

    /**
     *
     * @return
     */
    public boolean getIsOperador() {
        return this.isOperador();
    }

    /**
     * @return
     */
    public boolean isOperador() {
        if (isAdministrador)
            return true;

        if (this.colaboradores != null)
            for (final Colaborador colaborador : this.colaboradores) {
                if (colaborador.getVinculo().equals(Vinculo.Operador) || colaborador.getVinculo().equals(Vinculo.OperadorArtendente))
                    return true;
            }

        return false;
    }

    /**
     * @return
     */
    @Transient
    public boolean isAtendente() {
        if (this.colaboradores != null)
            for (final Colaborador colaborador : this.colaboradores) {
                if (colaborador.getVinculo().equals(Vinculo.Atendente) || colaborador.getVinculo().equals(Vinculo.OperadorArtendente))
                    return true;
            }

        return false;
    }


    /**
     * Retorna a instância de um usuário master
     */
    public static UserDetails getMasterUser() {

        final Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome(MASTER_USER_NAME);
        usuario.setEmail(MASTER_USER_EMAIL);
        usuario.setPassword(new BCryptPasswordEncoder().encode(MASTER_USER_PASSWORD));
        usuario.setAdministrador(true);

        return usuario;

    }

}
