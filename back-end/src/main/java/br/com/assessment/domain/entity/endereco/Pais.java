package br.com.assessment.domain.entity.endereco;

import br.com.assessment.domain.entity.generic.AbstractEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;
import org.hibernate.validator.constraints.Length;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

/**
 * Created by Emanuel Victor on 15/03/2017.
 */
@Data
@Entity
@Audited
@EqualsAndHashCode(callSuper = true)
public class Pais extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -7513339061739700255L;

    @NotEmpty
    @Length(max = 200)
    @Column(nullable = false, length = 200)
    private String nome;

    public Pais() {
    }

    public Pais(Long id) {
        this.id = id;
    }
}