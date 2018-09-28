package br.com.assessment.domain.entity.unidade;

import br.com.assessment.domain.entity.endereco.Endereco;
import br.com.assessment.domain.entity.usuario.Conta;
import br.com.assessment.domain.entity.usuario.Pessoa;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
public class Unidade extends Pessoa {

    @OneToOne(optional = false, cascade = CascadeType.ALL)
    private Endereco endereco;


    @Transient
    private Double media;

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
    public Unidade(final long id, final String nome, final String documento, final Endereco endereco,
                   final Double media, final long avaliacoes1, final long avaliacoes2, final long avaliacoes3, final long avaliacoes4, final long avaliacoes5) {

        this.id = id;
        this.nome = nome;
        this.documento = documento;

        this.endereco = endereco;

        this.media = media;
        this.avaliacoes1 = avaliacoes1;
        this.avaliacoes2 = avaliacoes2;
        this.avaliacoes3 = avaliacoes3;
        this.avaliacoes4 = avaliacoes4;
        this.avaliacoes5 = avaliacoes5;
    }

}
