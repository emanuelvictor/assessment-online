package online.meavalia.domain.entity.assinatura;

import lombok.Data;
import lombok.EqualsAndHashCode;
import online.meavalia.domain.entity.generic.AbstractEntity;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

import static online.meavalia.Application.DEFAULT_TENANT_ID;

@Data
@Entity
@Audited
@Table(schema = DEFAULT_TENANT_ID, uniqueConstraints = {
        @UniqueConstraint(columnNames = {"quantidade_avaliacoes", "valor_avaliacoes_excedentes", "valor_mensal"})
})
@EqualsAndHashCode(callSuper = true)
@Cacheable
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_ONLY)
public class Plano extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -3875941812412345616L;

    /**
     *
     */
    @Column(nullable = false, unique = true)
    private String nome;

    /**
     *
     */
    @Column(nullable = false, name = "quantidade_avaliacoes")
    private int quantidadeAvaliacoes;

    /**
     *
     */
    @Column(nullable = false, name = "valor_avaliacoes_excedentes")
    private BigDecimal valorAvaliacoesExcedentes;

    /**
     *
     */
    @Column(nullable = false, name = "valor_mensal")
    private BigDecimal valorMensal;

    /**
     *
     */
    public Plano() {
    }

    /**
     * @param id
     */
    public Plano(final long id) {
        super(id);
    }
}
