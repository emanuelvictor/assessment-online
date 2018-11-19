package br.com.assessment.domain.entity.usuario;

import br.com.assessment.domain.entity.colaborador.Colaborador;
import br.com.assessment.domain.entity.colaborador.Vinculo;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
     *
     */
    public Usuario() {
    }

    /**
     *
     */
    public Usuario(final long id, final String nome, final String email, final String thumbnailPath, final String avatarPath, final String fotoPath,
                   final Double media, final long quantidadeAvaliacoes, final long avaliacoes1, final long avaliacoes2, final long avaliacoes3, final long avaliacoes4, final long avaliacoes5) {

        final Conta conta = new Conta();
        conta.setId(id);
        conta.setEmail(email);
        this.conta = conta;

        this.id = id;
        this.nome = nome;
        this.thumbnailPath = thumbnailPath;
        this.avatarPath = avatarPath;
        this.fotoPath = fotoPath;

        this.media = media;
        this.quantidadeAvaliacoes = quantidadeAvaliacoes;
        this.avaliacoes1 = avaliacoes1;
        this.avaliacoes2 = avaliacoes2;
        this.avaliacoes3 = avaliacoes3;
        this.avaliacoes4 = avaliacoes4;
        this.avaliacoes5 = avaliacoes5;
    }

    public Usuario(final long id, final String nome, final String email, final String thumbnailPath, final String avatarPath, final String fotoPath) {

        final Conta conta = new Conta();
        conta.setId(id);
        conta.setEmail(email);
        this.conta = conta;

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
