package br.com.assessment.domain.entity.usuario;

import br.com.assessment.domain.entity.generic.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

@Data
@Entity
@Audited
@JsonIgnoreProperties({"authorities", "colaboradores"})
@lombok.EqualsAndHashCode(callSuper = true)
@Inheritance(strategy = InheritanceType.JOINED)
public class Pessoa extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -3782123951557287123L;

    /**
     *
     */
    @NotEmpty
    protected String nome;

    /**
     *
     */
    protected String documento;

}
