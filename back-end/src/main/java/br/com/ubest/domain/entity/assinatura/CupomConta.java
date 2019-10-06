package br.com.ubest.domain.entity.assinatura;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import br.com.ubest.domain.entity.usuario.Conta;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Set;

import static br.com.ubest.Application.DEFAULT_TENANT_ID;

@Data
@Entity
@Audited
@EqualsAndHashCode(callSuper = true)
@Table(schema = DEFAULT_TENANT_ID, uniqueConstraints = {
        @UniqueConstraint(columnNames = {"conta_id", "cupom_id"})
})
public class CupomConta extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -3875941812123465798L;

    /**
     *
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "conta_id")
    private Conta conta;

    /**
     *
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "cupom_id")
    private Cupom cupom;

    /**
     *
     */
    public CupomConta() {
    }

    /**
     * @param id
     */
    public CupomConta(final long id) {
        super(id);
    }
}
