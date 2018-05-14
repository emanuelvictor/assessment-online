package br.com.assessment.domain.entity.usuario;

import br.com.assessment.domain.entity.generic.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.hibernate.envers.Audited;
import org.hibernate.validator.constraints.Length;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Calendar;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Audited
@JsonIgnoreProperties({"authorities"})
@lombok.EqualsAndHashCode(callSuper = true)
public class Usuario extends AbstractEntity implements UserDetails, Serializable {

    private static final long serialVersionUID = -3782123951557287123L;

    /**
     * Senha padrão
     */
    protected static final String DEFAULT_PASSWORD = "no-password";

    /**
     * Senha do usuário master
     */
    public static final String MASTER_PASSWORD = "bm129000";

    /**
     * Usuário master
     */
    public static final String MASTER_USERNAME = "admin@admin.com";

    /**
     *
     */
    @NotEmpty
    private String nome;

    /**
     *
     */
    private String username;

    /**
     *
     */
    private String password;

//    /**
//     *
//     */
//    @NotNull
//    @Column(nullable = false)
//    @Enumerated(EnumType.ORDINAL)
//    private Profile profile;

    /**
     * // TODO: 10/01/18 alterar para LocalDateTime
     */
    private Calendar lastLogin;

    /**
     *
     */
    public Usuario() {
        super();
        this.password = DEFAULT_PASSWORD;
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
        return this.username;
    }

    @Override
    @Transient
    public Collection<? extends GrantedAuthority> getAuthorities() {

        final Set<GrantedAuthority> authorities = new HashSet<>();

        authorities.add(Profile.ASSAYING);
        authorities.add(Profile.OPERATOR);
        authorities.add(Profile.ADMINISTRATOR);

        return authorities;

    }

    /**
     * @return
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
     * @return
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * @return
     */
    @Override
    public boolean isEnabled() {
        return true;
    }

    /**
     * Retorna a instância de um usuário master
     *
     * @return
     */
    public static UserDetails getMasterUser() {

        final Usuario usuario = new Usuario();
        usuario.setNome("Administrator");
        usuario.setUsername(MASTER_USERNAME);
        usuario.setPassword(new BCryptPasswordEncoder().encode(MASTER_PASSWORD));

        return usuario;

    }



}
