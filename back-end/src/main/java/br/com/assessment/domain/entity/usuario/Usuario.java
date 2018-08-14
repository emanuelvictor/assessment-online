package br.com.assessment.domain.entity.usuario;

import br.com.assessment.domain.entity.colaborador.Colaborador;
import br.com.assessment.domain.entity.colaborador.Vinculo;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
public class Usuario extends Pessoa {

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
     * Remover o transient
     * PORQUE ESTÁ EAGER
     */
    @JsonProperty
    @OneToMany(mappedBy = "usuario", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<Colaborador> colaboradores;

    /**
     *
     */
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Conta conta;

    /**
     *
     */
    public Usuario() {
    }

    /**
     *
     */
    public boolean isOperador() {

        if (this.colaboradores != null)
            for (final Colaborador colaborador : this.colaboradores) {
                if (colaborador.getVinculo().equals(Vinculo.Operador) || colaborador.getVinculo().equals(Vinculo.OperadorAtendente))
                    return true;
            }

        return false;
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
    public boolean isAtendente() {
        if (this.colaboradores != null)
            for (final Colaborador colaborador : this.colaboradores) {
                if (colaborador.getVinculo().equals(Vinculo.Atendente) || colaborador.getVinculo().equals(Vinculo.OperadorAtendente))
                    return true;
            }

        return false;
    }

    /**
     *
     */
    public boolean getIsAtendente() {
        return this.isAtendente();
    }

    /**
     *
     * @return
     */
    public boolean getIsAdministrador() {
        return this.conta != null && this.conta.isAdministrador();
    }

    /**
     * @param fotoPath
     */
    public void setFotoPath(String fotoPath) {
        if (fotoPath != null)
            fotoPath = "./usuarios/" + id + "/foto";
        this.fotoPath = fotoPath;
    }

    /**
     * @param avatarPath
     */
    public void setAvatarPath(String avatarPath) {
        if (avatarPath != null)
            avatarPath = "./usuarios/" + id + "/avatar";
        this.avatarPath = avatarPath;
    }

    /**
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
     * @return {}
     */
    public String getThumbnailPath() {
        if (this.thumbnail != null)
            return "./usuarios/" + id + "/thumbnail";
        return null;
    }


}
