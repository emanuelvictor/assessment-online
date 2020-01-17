package online.meavalia.domain.entity.endereco;

import lombok.Data;
import lombok.EqualsAndHashCode;
import online.meavalia.domain.entity.generic.AbstractEntity;
import org.hibernate.envers.Audited;
import org.hibernate.validator.constraints.Length;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

import static online.meavalia.Application.DEFAULT_TENANT_ID;


/**
 * Created by Emanuel Victor on 15/03/2017.
 */
@Data
@Entity
@Audited
@Table(schema = DEFAULT_TENANT_ID)
@EqualsAndHashCode(callSuper = true)
public class Pais extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -7513339061739700255L;

    @NotEmpty
    @Length(max = 200)
    @Column(nullable = false, length = 200)
    private String nome;

}
