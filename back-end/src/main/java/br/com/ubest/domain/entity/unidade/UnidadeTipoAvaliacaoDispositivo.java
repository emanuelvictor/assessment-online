package br.com.ubest.domain.entity.unidade;

import br.com.ubest.domain.entity.avaliacao.UnidadeTipoAvaliacao;
import br.com.ubest.domain.entity.generic.AbstractEntity;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Audited
@NoArgsConstructor
@lombok.EqualsAndHashCode(callSuper = true)
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"unidade_tipo_avaliacao_id", "dispositivo_id"}),
        @UniqueConstraint(columnNames = {"unidade_tipo_avaliacao_id", "dispositivo_id", "ordem"})
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
    @ManyToOne(optional = false)
    private UnidadeTipoAvaliacao unidadeTipoAvaliacao;

    /**
     *
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "dispositivo_id")
    private Dispositivo dispositivo;

    /**
     *
     */
    private boolean ativo = true;

}
