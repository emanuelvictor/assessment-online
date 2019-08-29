package br.com.ubest.domain.entity.unidade;

import br.com.ubest.domain.entity.avaliacao.UnidadeTipoAvaliacao;
import br.com.ubest.domain.entity.generic.AbstractEntity;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Audited
@NoArgsConstructor
@lombok.EqualsAndHashCode(callSuper = true)
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"unidade_tipo_avaliacao_id", "licenca_id"}),
        @UniqueConstraint(columnNames = {"unidade_tipo_avaliacao_id", "licenca_id", "ordem"})
})
public class UnidadeTipoAvaliacaoLicenca extends AbstractEntity implements Serializable {

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
    @JoinColumn(name = "licenca_id")
    private Licenca licenca;

    /**
     *
     */
    private boolean ativo = true;

}
