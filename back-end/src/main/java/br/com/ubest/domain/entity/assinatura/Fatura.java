package br.com.ubest.domain.entity.assinatura;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDate;

import static br.com.ubest.Application.DEFAULT_TENANT_ID;

@Data
@Entity
@Audited
@Table(schema = DEFAULT_TENANT_ID)
@EqualsAndHashCode(callSuper = true)
public class Fatura extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -3875995612412345616L;

    /**
     *
     */
    @NotNull
    @Length(max = 150)
    @Column(nullable = false, updatable = false)
    private String tenant;

    /**
     *
     */
    @Column(unique = true)
    private String linkBoleto;

    /**
     *
     */
    @Column
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataInicio;

    /**
     *
     */
    @Column
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataTermino;

    /**
     *
     */
    @Column
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataPagamento;

    /**
     *
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "assinatura_id")
    private Assinatura assinatura;

    /**
     *
     */
    @ManyToOne
    @JoinColumn(name = "desconto_id")
    private Desconto desconto;

    /**
     *
     */
    public Fatura() {
    }

    /**
     *
     * @param id
     */
    public Fatura(final long id) {
        super(id);
    }
}
