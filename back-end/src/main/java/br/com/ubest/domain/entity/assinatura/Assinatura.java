package br.com.ubest.domain.entity.assinatura;

import br.com.ubest.domain.entity.avaliacao.AvaliacaoAvaliavel;
import br.com.ubest.domain.entity.endereco.Endereco;
import br.com.ubest.domain.entity.generic.AbstractEntity;
import br.com.ubest.domain.entity.unidade.Licenca;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Data;
import org.hibernate.envers.Audited;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.Set;

import static br.com.ubest.Application.DEFAULT_TENANT_ID;

@Data
@Entity
@Audited
@Table(schema = DEFAULT_TENANT_ID)
@lombok.EqualsAndHashCode(callSuper = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.UUIDGenerator.class)
public class Assinatura extends AbstractEntity {

    private static final long serialVersionUID = -3875941812495359616L;

    /**
     *
     */
    @NotNull
    @Column(nullable = false, updatable = false, length = 150)
    @Length(max = 150)
    private String tenant;


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
    @Column(unique = true)
    private Long numeroCartao;

    /**
     *
     */
    @Column
    private String nomeTitularCartao;

//    /**
//     * TODO não precisa
//     */
//    @Column
//    private Boolean isEmpresa;

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
    private byte codigoArea;

    /**
     *
     */
    @Column
    private long telefone;

    /**
     * TODO ?
     * Para pagamento com cartão de crédito
     */
    @Transient
    private String hash;

    /**
     *
     */
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Endereco endereco;

    /**
     *
     */
    @OneToMany(targetEntity = Licenca.class, mappedBy = "assinatura", fetch = FetchType.EAGER, orphanRemoval = true)
    private Set<Licenca> licencas;

}
