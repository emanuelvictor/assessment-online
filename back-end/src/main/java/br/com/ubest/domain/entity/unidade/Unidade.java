package br.com.ubest.domain.entity.unidade;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import br.com.ubest.domain.entity.usuario.Pessoa;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Transient;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
public class Unidade extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -12345665123456789L;

    /**
     *
     */
    private String agradecimento;

    /**
     *
     */
    @NotNull
    @NotEmpty
    @Column(nullable = false)
    private String nome;

    @Transient
    private Object media;

    @Transient
    private long quantidadeAvaliacoes;

    @Transient
    private long avaliacoes1;

    @Transient
    private long avaliacoes2;

    @Transient
    private long avaliacoes3;

    @Transient
    private long avaliacoes4;

    @Transient
    private long avaliacoes5;

    /**
     *
     */
    public Unidade() {
    }

    /**
     *
     */
    public Unidade(final long id, final String nome) {

        this.id = id;
        this.nome = nome;

    }

    /**
     *
     */
    public Unidade(final long id, final String nome,
                   final Double media, final long quantidadeAvaliacoes, final long avaliacoes1, final long avaliacoes2, final long avaliacoes3, final long avaliacoes4, final long avaliacoes5) {

        this.id = id;
        this.nome = nome;

        this.media = media;
        this.quantidadeAvaliacoes = quantidadeAvaliacoes;
        this.avaliacoes1 = avaliacoes1;
        this.avaliacoes2 = avaliacoes2;
        this.avaliacoes3 = avaliacoes3;
        this.avaliacoes4 = avaliacoes4;
        this.avaliacoes5 = avaliacoes5;

    }

}
