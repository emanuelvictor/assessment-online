package br.com.assessment.domain.entity.colaborador;

import br.com.assessment.domain.entity.generic.AbstractEntity;
import br.com.assessment.domain.entity.unidade.Unidade;
import br.com.assessment.domain.entity.usuario.Usuario;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Data
@Entity
@Audited
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"unidade_id", "usuario_id"})
})
@lombok.EqualsAndHashCode(callSuper = true)
public class Colaborador extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -3782123951512387123L;

    /**
     *
     */
    @NotNull
    @ManyToOne(optional = false)
    private Usuario usuario;

    /**
     *
     */
    @NotNull
    @ManyToOne(optional = false)
    private Unidade unidade;

    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    private Vinculo vinculo;

    /**
     *
     */
    public Colaborador() {
        super();
        this.vinculo = Vinculo.Nenhum;
    }

}
