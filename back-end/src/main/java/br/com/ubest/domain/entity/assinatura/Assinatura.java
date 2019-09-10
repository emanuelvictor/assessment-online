package br.com.ubest.domain.entity.assinatura;

import br.com.ubest.domain.entity.avaliacao.AvaliacaoAvaliavel;
import br.com.ubest.domain.entity.endereco.Endereco;
import br.com.ubest.domain.entity.generic.AbstractEntity;
import br.com.ubest.domain.entity.generic.EntityIdResolver;
import br.com.ubest.domain.entity.unidade.Licenca;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.envers.Audited;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Set;

import static br.com.ubest.Application.DEFAULT_TENANT_ID;

@Data
@Entity
@Audited
@NoArgsConstructor
@Table(schema = DEFAULT_TENANT_ID)
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
     *
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
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private Plano plano;

//    /**
//     * TODO testar
//     */
//    @EqualsAndHashCode.Exclude
//    @OneToMany(targetEntity = Licenca.class, mappedBy = "assinatura", fetch = FetchType.EAGER, orphanRemoval = true)
//    private Set<Licenca> licencas;

}
