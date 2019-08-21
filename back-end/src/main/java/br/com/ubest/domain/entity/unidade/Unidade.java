package br.com.ubest.domain.entity.unidade;

import br.com.ubest.domain.entity.endereco.Endereco;
import br.com.ubest.domain.entity.usuario.Pessoa;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.math.BigDecimal;

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
    @ManyToOne
    @JoinColumn(name = "unidade_superior_id")
    private Unidade unidadeSuperior;

    /*-------------------------------------------------------------------
     * 		 				ATRIBUTOS DE DISPOSITIVO
     *-------------------------------------------------------------------*/
    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    private boolean publico = false;

    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    private boolean modoQuiosque = false;

    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    private boolean modoInsonia;

    /**
     *
     */
    @Min(value = 5, message = "O mínimo são 5 segundos")
    @Max(value = 600, message = "O máximo são 10 minutos (600 segundos)")
    private short time = 30;

    /**
     *
     */
    private boolean quebrarLinhaNaSelecaoDeItemAvaliavel;

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

    /**
     * @param id
     * @param nome
     * @param documento
     * @param endereco
     * @param media
     * @param quantidadeAvaliacoes
     * @param avaliacoes1
     * @param avaliacoes2
     * @param avaliacoes3
     * @param avaliacoes4
     * @param avaliacoes5
     * @param publico
     * @param modoQuiosque
     * @param modoInsonia
     * @param time
     * @param quebrarLinhaNaSelecaoDeItemAvaliavel
     */
    public Unidade(final long id, final String nome, final String documento, final Endereco endereco,
                   final Double media, final long quantidadeAvaliacoes, final long avaliacoes1, final long avaliacoes2, final long avaliacoes3, final long avaliacoes4, final long avaliacoes5,
                   final boolean publico, final boolean modoQuiosque, final boolean modoInsonia, final short time, final boolean quebrarLinhaNaSelecaoDeItemAvaliavel) {
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

        this.publico = publico;
        this.modoQuiosque = modoQuiosque;
        this.modoInsonia = modoInsonia;
        this.time = time;
        this.quebrarLinhaNaSelecaoDeItemAvaliavel = quebrarLinhaNaSelecaoDeItemAvaliavel;

    }
}
