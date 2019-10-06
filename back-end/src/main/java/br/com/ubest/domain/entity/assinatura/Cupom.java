package br.com.ubest.domain.entity.assinatura;

import br.com.ubest.domain.entity.generic.AbstractEntity;
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
@Table(schema = DEFAULT_TENANT_ID)
@EqualsAndHashCode(callSuper = true)
public class Cupom extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -3875941812412341566L;

    /**
     *
     */
    @OneToMany(targetEntity = CupomConta.class, mappedBy = "cupom", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<CupomConta> cupomContas;

    /**
     *
     */
    @NotNull
    @Length(max = 150)
    @Column(nullable = false, unique = true)
    private String codigo;

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

    /**
     * @param id
     * @param codigo
     * @param percentualDesconto
     */
    public Cupom(final Long id, final @NotNull @Length(max = 150) String codigo, final @NotNull BigDecimal percentualDesconto) {
        super(id);
        this.codigo = codigo;
        this.percentualDesconto = percentualDesconto;
    }
}
