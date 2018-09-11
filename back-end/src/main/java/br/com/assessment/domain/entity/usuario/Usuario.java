package br.com.assessment.domain.entity.usuario;

import br.com.assessment.domain.entity.colaborador.Colaborador;
import br.com.assessment.domain.entity.colaborador.Vinculo;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Data;
import lombok.NoArgsConstructor;
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
    @JsonIgnore
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
    @JsonIgnore
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
    @JsonIgnore
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
     */
    public Usuario(final long id, final String nome, final String email, final String thumbnailPath, final String avatarPath, final String fotoPath) {
        this.id = id;
        this.nome = nome;
        this.thumbnailPath = thumbnailPath;
        this.avatarPath = avatarPath;
        this.fotoPath = fotoPath;
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
     */
    public boolean getIsOperador() {
        return this.isOperador();
    }

    /**
     *
     */
    public boolean getIsAtendente() {
        return this.isAtendente();
    }

    /**
     */
    public boolean getIsAdministrador() {
        return this.conta != null && this.conta.isAdministrador();
    }


    @PrePersist
    @PreUpdate
    public void handlePathFoto() {
        if (this.foto != null) {
            this.fotoPath = "./usuarios/" + id + "/foto";
            this.avatarPath = "./usuarios/" + id + "/avatar";
            this.thumbnailPath = "./usuarios/" + id + "/thumbnail";
        } else {
            this.fotoPath = null;
            this.avatarPath = null;
            this.thumbnailPath = null;
        }
    }
}
