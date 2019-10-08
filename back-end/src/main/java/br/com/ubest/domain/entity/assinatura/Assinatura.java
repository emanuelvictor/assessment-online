package br.com.ubest.domain.entity.assinatura;

import br.com.ubest.domain.entity.endereco.Endereco;
import br.com.ubest.domain.entity.generic.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.NoArgsConstructor;
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
    private String nomeTitularCartao;

    /**
     *
     */
    @Column
    private Boolean souEmpresa = false;

    /**
     *
     */
    @Column
    private String documentoTitularCartao;

    /**
     *
     */
    @Column
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataNascimentoTitularCartao;

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
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, targetEntity = Endereco.class )
    private Endereco endereco;

    /**
     *
     */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private Plano plano;

//    /**
//     * TODO testar
//     */
//    @EqualsAndHashCode.Exclude
//    @OneToMany(targetEntity = Dispositivo.class, mappedBy = "assinatura", fetch = FetchType.EAGER, orphanRemoval = true)
//    private Set<Dispositivo> dispositivos;

}
