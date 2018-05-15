package br.com.assessment.domain.entity.vinculo;

import br.com.assessment.domain.entity.generic.AbstractEntity;
import br.com.assessment.domain.entity.unidade.Unidade;
import br.com.assessment.domain.entity.usuario.Usuario;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
public class Colaborador extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -3782123951512387123L;

    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    private Usuario usuario;

    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    private Unidade unidade;

    /**
     *
     */
    @NotNull
    private boolean isAtendente;

    /**
     *
     */
    @NotNull
    private boolean isOperador;
}
