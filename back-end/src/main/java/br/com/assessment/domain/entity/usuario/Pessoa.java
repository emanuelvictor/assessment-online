package br.com.assessment.domain.entity.usuario;

import br.com.assessment.domain.entity.generic.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Transient;
import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

@Data
@Entity
@Audited
@JsonIgnoreProperties({"authorities", "colaboradores"})
@lombok.EqualsAndHashCode(callSuper = true)
@Inheritance(strategy = InheritanceType.JOINED)
public class Pessoa extends AbstractEntity implements Serializable {

    protected static final long serialVersionUID = -3782123951557287123L;

    /**
     *
     */
    @NotEmpty
    protected String nome;

    /**
     * TODO fazer unique
     */
    protected String documento;

    @Transient
    protected Double media;

    @Transient
    protected long quantidadeAvaliacoes;

    @Transient
    protected long avaliacoes1;

    @Transient
    protected long avaliacoes2;

    @Transient
    protected long avaliacoes3;

    @Transient
    protected long avaliacoes4;

    @Transient
    protected long avaliacoes5;

}
