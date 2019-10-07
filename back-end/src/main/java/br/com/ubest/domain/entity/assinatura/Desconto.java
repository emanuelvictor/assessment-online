package br.com.ubest.domain.entity.assinatura;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import br.com.ubest.domain.entity.usuario.Conta;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

import static br.com.ubest.Application.DEFAULT_TENANT_ID;

@Data
@Entity
@Audited
@EqualsAndHashCode(callSuper = true)
@Table(schema = DEFAULT_TENANT_ID, uniqueConstraints = {
        @UniqueConstraint(columnNames = {"conta_id", "cupom_id"})
})
public class Desconto extends AbstractEntity implements Serializable {

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
    @NotNull
    @Column(nullable = false, name = "percentual_desconto")
    private BigDecimal percentualDesconto;

    /**
     *
     */
    @Column
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataVencimento;

    /**
     *
     */
    public Desconto() {
    }

    /**
     * @param id
     */
    public Desconto(final long id) {
        super(id);
    }
}
