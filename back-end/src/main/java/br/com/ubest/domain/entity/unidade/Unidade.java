package br.com.ubest.domain.entity.unidade;

import br.com.ubest.domain.entity.endereco.Endereco;
import br.com.ubest.domain.entity.usuario.Pessoa;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import java.io.Serializable;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
public class Unidade extends Pessoa implements Serializable {

    private static final long serialVersionUID = -12345665123456789L;

    /**
     *
     */
    @OneToOne(cascade = CascadeType.ALL)
    private Endereco endereco;

    /**
     *
     */
    private String agradecimento;

    /**
     *
     */
    public Unidade() {
    }

    /**
     *
     */
    public Unidade(final long id, final String nome, final String documento, final Endereco endereco) {

        this.id = id;
        this.nome = nome;
        this.documento = documento;

        this.endereco = endereco;

    }

    /**
     *
     */
    public Unidade(final long id, final String nome, final String documento, final Endereco endereco,
                   final Double media, final long quantidadeAvaliacoes, final long avaliacoes1, final long avaliacoes2, final long avaliacoes3, final long avaliacoes4, final long avaliacoes5) {

        this.id = id;
        this.nome = nome;
        this.documento = documento;

        this.endereco = endereco;

        this.media = media;
        this.quantidadeAvaliacoes = quantidadeAvaliacoes;
        this.avaliacoes1 = avaliacoes1;
        this.avaliacoes2 = avaliacoes2;
        this.avaliacoes3 = avaliacoes3;
        this.avaliacoes4 = avaliacoes4;
        this.avaliacoes5 = avaliacoes5;
    }

}
