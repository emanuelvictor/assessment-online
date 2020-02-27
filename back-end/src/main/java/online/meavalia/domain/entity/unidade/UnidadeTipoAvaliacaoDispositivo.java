package online.meavalia.domain.entity.unidade;

import lombok.Data;
import lombok.NoArgsConstructor;
import online.meavalia.domain.entity.avaliacao.UnidadeTipoAvaliacao;
import online.meavalia.domain.entity.generic.AbstractEntity;
import online.meavalia.domain.entity.usuario.vinculo.Avaliavel;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

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

    /**
     *
     */
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
    @JoinColumn(name = "unidade_tipo_avaliacao_id")
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

    /**
     *
     */
    @Transient
    private Set<Avaliavel> avaliaveis;

}
