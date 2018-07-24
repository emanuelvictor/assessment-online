package br.com.assessment.domain.entity.usuario;

import br.com.assessment.domain.entity.colaborador.Colaborador;
import br.com.assessment.domain.entity.colaborador.Vinculo;
import lombok.Data;
import org.hibernate.envers.Audited;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
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
     * -----------------------------------------------------------
     *                          Foto
     * -----------------------------------------------------------
     */

    /**
     *
     */
    @Column
    private byte[] foto;

    /**
     *
     */
    @Column
    private String fotoPath;

    /**
     *
     */
    @Column
    private byte[] avatar;

    /**
     *
     */
    @Column
    private String avatarPath;

    /**
     *
     */
    @Column
    private byte[] thumbnail;

    /**
     *
     */
    @Column
    private String thumbnailPath;

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
    @NotNull
    private boolean isAdministrador;

    /**
     *
     */
    @Transient
    @OneToMany(mappedBy = "usuario")
    private List<Colaborador> colaboradores;

    /**
     *
     */
    private LocalDateTime lastLogin;

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
     * @return
     */
    public boolean getIsAdministrador() {
        return this.isAdministrador;
    }

    /**
     * @return
     */
    public boolean getIsOperador() {
        return this.isOperador();
    }

    /**
     *
     */
    public boolean isOperador() {
        if (isAdministrador)
            return true;

        if (this.colaboradores != null)
            for (final Colaborador colaborador : this.colaboradores) {
                if (colaborador.getVinculo().equals(Vinculo.Operador) || colaborador.getVinculo().equals(Vinculo.OperadorAtendente))
                    return true;
            }

        return false;
    }

    /**
     *
     */
    public boolean isAtendente() {
        if (this.colaboradores != null)
            for (final Colaborador colaborador : this.colaboradores) {
                if (colaborador.getVinculo().equals(Vinculo.Atendente) || colaborador.getVinculo().equals(Vinculo.OperadorAtendente))
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

    /**
     *
     * @param fotoPath
     */
    public void setFotoPath(String fotoPath) {
        if (fotoPath != null)
            fotoPath = "./usuarios/" + id + "/foto";
        this.fotoPath = fotoPath;
    }

    /**
     *
     * @param avatarPath
     */
    public void setAvatarPath(String avatarPath) {
        if (avatarPath != null)
            avatarPath = "./usuarios/" + id + "/avatar";
        this.avatarPath = avatarPath;
    }

    /**
     *
     * @param thumbnailPath
     */
    public void setThumbnailPath(String thumbnailPath) {
        if (thumbnailPath != null)
            thumbnailPath = "./usuarios/" + id + "/thumbnail";
        this.thumbnailPath = thumbnailPath;
    }

    /**
     * @return {}
     */
    public String getFotoPath() {
        if (this.foto != null)
            return "./usuarios/" + id + "/foto";
        return null;
    }

    /**
     * @return {}
     */
    public String getAvatarPath() {
        if (this.avatar != null)
            return "./usuarios/" + id + "/avatar";
        return null;
    }

    /**
     *
     * @return {}
     */
    public String getThumbnailPath() {
        if (this.thumbnail != null)
            return "./usuarios/" + id + "/thumbnail";
        return null;
    }
}
