package online.meavalia.domain.entity.assinatura;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.NoArgsConstructor;
import online.meavalia.domain.entity.endereco.Endereco;
import online.meavalia.domain.entity.generic.AbstractEntity;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDate;

/**
 * @author Emanuel Victor
 * @version 1.0.0
 * @since 1.0.0, 10/09/2019
 */
@Data
@Entity
@Audited
@NoArgsConstructor
@lombok.EqualsAndHashCode(callSuper = true)
public class Assinatura extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -3875941812495359616L;

    /**
     *
     */
    @Column
    private String clientId;

    /**
     *
     */
    @Column
    private String mesValidade;

    /**
     *
     */
    @Column
    private String anoValidade;

    /**
     *
     */
    @Min(1)
    @Max(28)
    @NotNull
    @Column(nullable = false)
    private short diaVencimentoFatura = 5;

    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    @Enumerated(EnumType.ORDINAL)
    private FormaPagamento formaPagamento;

    /**
     *
     */
    @Column(unique = true)
    private String numeroCartao;

    /**
     *
     */
    @Column
    private String nomeTitular;

    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    private boolean agruparFaturas = true;

    /**
     *
     */
    @Column
    private Boolean souEmpresa = false;

    /**
     *
     */
    @Column
    private String documentoTitular;

    /**
     *
     */
    @Column
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataNascimentoTitular;

    /**
     *
     */
    @Column
    private Byte codigoArea;

    /**
     *
     */
    @Column
    private Long telefone;

    /**
     * Para pagamento com cartão de crédito
     */
    @Column
    private String hash;

    /**
     *
     */
    @JoinColumn(name = "endereco_id")
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, targetEntity = Endereco.class)
    private Endereco endereco;

    /**
     *
     */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private Plano plano;

    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    private boolean cancelada;
//    /**
//     * TODO testar
//     */
//    @EqualsAndHashCode.Exclude
//    @OneToMany(targetEntity = Dispositivo.class, mappedBy = "assinatura", fetch = FetchType.EAGER, orphanRemoval = true)
//    private Set<Dispositivo> dispositivos;

    /**
     * @return
     */
    @Transient
    public boolean isCompleted() {

        if (this.endereco == null)
            return false;

        if (this.endereco.getLogradouro() == null)
            return false;
        if (this.endereco.getBairro() == null)
            return false;
        if (this.endereco.getCep() == null)
            return false;
        if (this.endereco.getNumero() == null)
            return false;

        if (this.endereco.getCidade() == null)
            return false;
        if (this.endereco.getCidade().getNome() == null)
            return false;

        if (this.endereco.getCidade().getEstado() == null)
            return false;
        if (this.endereco.getCidade().getEstado().getNome() == null)
            return false;
        if (this.endereco.getCidade().getEstado().getUf() == null)
            return false;

        if (this.endereco.getCidade().getEstado().getPais() == null)
            return false;
        if (this.endereco.getCidade().getEstado().getPais().getNome() == null)
            return false;

        if (this.codigoArea == null)
            return false;
        if (this.telefone == null)
            return false;

        if (this.plano == null)
            return false;

        if (this.formaPagamento == null)
            return false;

        if (this.formaPagamento.equals(FormaPagamento.CARTAO)) {
            if (this.hash == null)
                return false;
            if (this.documentoTitular == null)
                return false;
            if (this.dataNascimentoTitular == null)
                return false;
            if (this.numeroCartao == null)
                return false;
            if (this.nomeTitular == null)
                return false;
            return this.anoValidade != null;
        }

        return true;
    }

    /**
     * @return
     */
    @Transient
    public boolean isTransactioned() {
        return isCompleted() && clientId != null;
    }

}
