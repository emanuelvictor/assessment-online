package online.meavalia.domain.entity.endereco;


import online.meavalia.domain.entity.generic.AbstractEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

import static online.meavalia.Application.DEFAULT_TENANT_ID;


/**
 * Created by Emanuel Victor on 15/03/2017.
 */
@Data
@Entity
@Audited
@EqualsAndHashCode(callSuper = true)
@Table(schema = DEFAULT_TENANT_ID, uniqueConstraints = {
        @UniqueConstraint(columnNames = {"nome", "pais_id"})
})
public class Estado extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = 8414044637595122330L;

    @NotEmpty
    @Length(max = 200)
    @Column(nullable = false, length = 200)
    private String nome;

    @NotEmpty
    @Length(max = 2)
    @Column(nullable = false, length = 2)
    private String uf;

    @NotNull
    @ManyToOne(optional = false)
    private Pais pais;

}
