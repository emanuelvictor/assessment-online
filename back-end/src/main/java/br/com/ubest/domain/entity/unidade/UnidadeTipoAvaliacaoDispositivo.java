package br.com.ubest.domain.entity.unidade;

import br.com.ubest.domain.entity.avaliacao.UnidadeTipoAvaliacao;
import br.com.ubest.domain.entity.generic.AbstractEntity;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"unidade_tipo_avaliacao_id", "dispositivo_id"}),
        @UniqueConstraint(columnNames = {"dispositivo_id", "ordem"})
})
public class UnidadeTipoAvaliacaoDispositivo extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -12341234065123632L;

    /**
     * Ordem em que a avaliação será exibida no tablet
     */
    @Column
    private Short ordem;

    /**
     *
     */
    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "unidade_tipo_avaliacao_id")
    private UnidadeTipoAvaliacao unidadeTipoAvaliacao;

    /**
     *
     */
    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "dispositivo_id")
    private Dispositivo dispositivo;

    /**
     *
     */
    private boolean ativo = true;

    /**
     *
     */
    public UnidadeTipoAvaliacaoDispositivo() {
    }

    /**
     * @param id {Long}
     */
    public UnidadeTipoAvaliacaoDispositivo(Long id) {
        super(id);
    }

    /**
     *
     */
    @PrePersist
    public void prePersist() {
        this.ordem = null;
        this.ativo = this.id == null || this.id == 0 || !this.ativo;
    }

}
