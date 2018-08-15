package br.com.assessment.domain.entity.unidade;

import br.com.assessment.domain.entity.endereco.Endereco;
import br.com.assessment.domain.entity.usuario.Pessoa;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
public class Unidade extends Pessoa {

    @OneToOne(optional = false, cascade = CascadeType.ALL)
    private Endereco endereco;

}
