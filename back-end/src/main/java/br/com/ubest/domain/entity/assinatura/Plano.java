package br.com.ubest.domain.entity.assinatura;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.envers.Audited;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import java.io.Serializable;
import java.math.BigDecimal;

import static br.com.ubest.Application.DEFAULT_TENANT_ID;

@Data
@Entity
@Audited
@Table(schema = DEFAULT_TENANT_ID, uniqueConstraints = {
        @UniqueConstraint(columnNames = {"quantidade_avaliacoes", "valor_avaliacoes_excedentes", "valor_mensal"})
})
@EqualsAndHashCode(callSuper = true)
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
     *
     * @param id
     */
    public Plano(final long id) {
        super(id);
    }
}
