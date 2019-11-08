package br.com.ubest.domain.entity.assinatura;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;
import org.hibernate.validator.constraints.Length;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

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
    @Length(max = 150)
    @Column(unique = true)
    private String tenant;

    /**
     *
     */
    @NotNull
    @Length(max = 150)
    @Column(nullable = false)
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
    @Column
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataVencimento;

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
     */
    public Cupom(final Long id, final @NotNull @Length(max = 150) String codigo) {
        super(id);
        this.codigo = codigo;
    }
}
