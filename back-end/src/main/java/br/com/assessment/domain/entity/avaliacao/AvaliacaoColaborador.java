package br.com.assessment.domain.entity.avaliacao;

import br.com.assessment.domain.entity.colaborador.Colaborador;
import br.com.assessment.domain.entity.generic.AbstractEntity;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"colaborador_id", "avaliacao_id"})
})
public class AvaliacaoColaborador extends AbstractEntity {
    /**
     *
     */
//    @NotNull
    @ManyToOne(optional = false)
    private Colaborador colaborador;

    /**
     *
     */
//    @NotNull
    @ManyToOne(optional = false)
    private Avaliacao avaliacao;
}
