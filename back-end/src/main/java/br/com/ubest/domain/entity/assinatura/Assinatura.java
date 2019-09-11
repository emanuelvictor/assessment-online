package br.com.ubest.domain.entity.assinatura;

import br.com.ubest.domain.entity.endereco.Endereco;
import br.com.ubest.domain.entity.generic.AbstractEntity;
import br.com.ubest.domain.entity.unidade.UnidadeTipoAvaliacaoLicenca;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDateTime;

import static br.com.ubest.Application.DEFAULT_TENANT_ID;

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
    @Column
    private LocalDateTime dataVencimento;

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
    private Long numeroCartao;

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
    private LocalDateTime dataNascimentoTitularCartao;

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
    @Transient
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
//    @OneToMany(targetEntity = Licenca.class, mappedBy = "assinatura", fetch = FetchType.EAGER, orphanRemoval = true)
//    private Set<Licenca> licencas;

}