package br.com.assessment.domain.entity.avaliacao;

import br.com.assessment.domain.entity.generic.AbstractEntity;
import br.com.assessment.domain.entity.unidade.Unidade;
import br.com.assessment.domain.entity.usuario.Usuario;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
public class UnidadeTipoAvaliacao extends AbstractEntity {

    /**
     * Ordem em que a avaliação será exibida no tablet
     */
    @Column
    private short ordem;

    /**
     *
     */
    @NotNull
    @ManyToOne(optional = false)
    private TipoAvaliacao tipoAvaliacao;

    /**
     *
     */
    @NotNull
    @ManyToOne(optional = false)
    private Unidade unidade;
}
