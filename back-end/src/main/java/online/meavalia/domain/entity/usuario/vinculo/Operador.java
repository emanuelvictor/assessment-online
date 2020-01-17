package online.meavalia.domain.entity.usuario.vinculo;

import lombok.Data;
import online.meavalia.domain.entity.generic.AbstractEntity;
import online.meavalia.domain.entity.unidade.Unidade;
import online.meavalia.domain.entity.usuario.Usuario;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"usuario_id", "unidade_id"})
})
public class Operador extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -963123951512387123L;

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

}
