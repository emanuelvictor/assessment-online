package br.com.assessment.domain.entity.endereco;

import br.com.assessment.domain.entity.generic.AbstractEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

import static br.com.assessment.application.multitenancy.Context.DEFAULT_TENANT_ID;

/**
 * Created by Emanuel Victor on 15/03/2017.
 */
@Data
@Entity
@Audited
@Table(schema = DEFAULT_TENANT_ID, uniqueConstraints = {
        @UniqueConstraint(columnNames = {"nome", "estado_id"})
})
@EqualsAndHashCode(callSuper = true)
public class Cidade extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = 3822122969075543760L;

    @NotEmpty
    @Length(max = 200)
    @Column(nullable = false, length = 200)
    private String nome;

    @NotNull
    @ManyToOne(optional = false)
    private Estado estado;

    public Cidade(Long id) {
        this.id = id;
    }

    public Cidade() {
    }
}