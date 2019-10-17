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
     * Inserida quando o cara paga
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
    @JoinColumn(name = "cupom_id")
    private Cupom cupom;

    /**
     * TODO acho que não é necessário
     */
    @Column
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataInicio;

    /**
     * TODO acho que não é necessário
     */
    @Column
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataTermino;

    /**
     * TODO não é necessário
     */
    @NotNull
    @Column(nullable = false)
    @Enumerated(EnumType.ORDINAL)
    private StatusFatura status;

    /**
     *
     */
    public Fatura() {
    }

    /**
     * @param id
     */
    public Fatura(final long id) {
        super(id);
    }

    /**
     * @param tenant
     * @param assinatura
     */
    public Fatura(final @NotNull @Length(max = 150) String tenant, final Assinatura assinatura) {
        this.tenant = tenant;
        this.assinatura = assinatura;
        if (this.assinatura.isCancelada())
            this.status = StatusFatura.CANCELADA;
    }
}
