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
import java.util.ArrayList;
import java.util.Set;

import static br.com.ubest.Application.DEFAULT_TENANT_ID;

@Data
@Entity
@Audited
@EqualsAndHashCode(callSuper = true)
@Table(schema = DEFAULT_TENANT_ID, uniqueConstraints = {
        @UniqueConstraint(columnNames = {"tenant", "data_abertura"}),
        @UniqueConstraint(columnNames = {"tenant", "data_fechamento"}),
        @UniqueConstraint(columnNames = {"tenant", "data_vencimento"}),
})
public class Fatura extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -3875995612412345616L;

    /**
     *
     */
    @Column(unique = true)
    private String orderId;

    /**
     *
     */
    @Column(unique = true)
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
     * Inserida quando a fatura é inserida, refere-se á data de abertura da fatura.
     * Hardcoded pro dia 1 de t-do mês
     */
    @NotNull
    @JsonFormat(pattern = "dd/MM/yyyy")
    @Column(nullable = false, name = "data_abertura")
    private LocalDate dataAbertura;

    /**
     * Inserida quando a fatura é fechada.
     * Nesse momento também é inserido o pedido.
     * A fatura é sempre fechada um mês após sua abertura, no dia 1 (hardcoded)
     */
    @JsonFormat(pattern = "dd/MM/yyyy")
    @Column(name = "data_fechamento")
    private LocalDate dataFechamento;

    /**
     * Refere-se á data de vencimento da fatura.
     * Sempre é no dia devencimento da assinatura, dois meses depois da abertura da fatura.
     */
    @NotNull
    @JsonFormat(pattern = "dd/MM/yyyy")
    @Column(nullable = false, name = "data_vencimento")
    private LocalDate dataVencimento;

    /**
     * Inserida quando a fatura é executada
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
    private Set<Item> itens;

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
        this.dataAbertura = LocalDate.now().withDayOfMonth(1);
        this.dataVencimento = LocalDate.now().plusMonths(2).withDayOfMonth(this.assinatura.getDiaVencimentoFatura());
        this.cancelada = assinatura.isCancelada();
    }

    /**
     * @return
     */
    public BigDecimal getValor() {
        BigDecimal valor = new BigDecimal(0);
        if (itens != null)
            for (int i = 0; i < itens.size(); i++) {
                valor = valor.add(new ArrayList<>(itens).get(i).getPreco());
            }
        return valor;
    }

    /**
     *
     * @return
     */
    public BigDecimal getDesconto() {
        if (this.cupom != null)
            return getValor().multiply(this.cupom.getPercentualDesconto());
        return BigDecimal.ZERO;
    }
}
