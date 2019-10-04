package br.com.ubest.domain.entity.assinatura;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;
import org.hibernate.validator.constraints.Length;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.math.BigDecimal;

import static br.com.ubest.Application.DEFAULT_TENANT_ID;

@Data
@Entity
@Audited
@Table(schema = DEFAULT_TENANT_ID, uniqueConstraints = {
        @UniqueConstraint(columnNames = {"tenant", "percentual_desconto"})
})
@EqualsAndHashCode(callSuper = true)
public class Cupom extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -3875941812412341566L;

    /**
     *
     */
    @Length(max = 150)
    @Column(updatable = false)
    private String tenant;

    /**
     *
     */
    @NotNull
    @Column(nullable = false, name = "percentual_desconto")
    private BigDecimal percentualDesconto;

    /**
     *
     */
    public Cupom() {
    }

    /**
     * @param id
     */
    public Cupom(final long id) {
        super(id);
    }
}
