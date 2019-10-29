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
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

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
    @Column
    private String orderId;

    /**
     *
     */
    @Column
    private String paymentId;

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
     * Inserida quando a fatura é fechada,
     * Nesse momento também é inserido o pedido.
     */
    @NotNull
    @Column(nullable = false)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataFechamento;

    /**
     * Inserida quando o cara paga
     */
    @NotNull
    @Column(nullable = false)
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataVencimento;

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

//    /**
//     * todo DESCENSSÁRIO
//     */
//    @NotNull
//    @Column(nullable = false)
//    @Enumerated(EnumType.ORDINAL)
//    private StatusFatura status;

    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    private boolean cancelada;

    /**
     *
     */
    @EqualsAndHashCode.Exclude
    @OneToMany(targetEntity = Item.class, mappedBy = "fatura", fetch = FetchType.EAGER, orphanRemoval = true, cascade = CascadeType.ALL)
    private Set<Item> items;

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
        this.dataVencimento = assinatura.getDataVencimentoProximaFatura();
        this.cancelada = assinatura.isCancelada();
    }

    /**
     * @return
     */
    public BigDecimal getValor() {
        final BigDecimal valor = new BigDecimal(0);
        if (items != null)
            this.items.forEach(item -> valor.add(item.getPreco()));
        return valor;
    }

    /**
     * @return
     */
    public BigDecimal getValorComDesconto() {
        if (this.cupom != null)
            return getValor().divideToIntegralValue(this.cupom.getPercentualDesconto()); //TODO verificar se é assim mesmo
        return getValor();
    }
}
