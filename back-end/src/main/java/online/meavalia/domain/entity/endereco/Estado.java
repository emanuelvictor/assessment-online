package online.meavalia.domain.entity.endereco;


import lombok.Data;
import lombok.EqualsAndHashCode;
import online.meavalia.domain.entity.generic.AbstractEntity;
import org.hibernate.annotations.CacheConcurrencyStrategy;
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
@Cacheable
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_ONLY)
public class Estado extends AbstractEntity implements Serializable {
    /**
     *
     */
    private static final long serialVersionUID = 8414044637595122330L;

    /**
     *
     */
    @NotEmpty
    @Length(max = 200)
    @Column(nullable = false, length = 200)
    private String nome;

    /**
     *
     */
    @NotEmpty
    @Length(max = 2)
    @Column(nullable = false, length = 2)
    private String uf;

    /**
     *
     */
    @NotNull
    @ManyToOne(optional = false)
    private Pais pais;

    /**
     *
     */
    public Estado() {
    }

    /**
     * @param id
     */
    public Estado(final Long id) {
        super(id);
    }
}
