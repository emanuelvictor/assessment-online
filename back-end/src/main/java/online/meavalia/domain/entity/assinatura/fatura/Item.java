package online.meavalia.domain.entity.assinatura.fatura;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Data;
import lombok.EqualsAndHashCode;
import online.meavalia.domain.entity.generic.AbstractEntity;
import online.meavalia.domain.entity.generic.EntityIdResolver;
import online.meavalia.domain.entity.unidade.Dispositivo;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Data
@Entity
@Audited
@EqualsAndHashCode(callSuper = true)
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id",
        scope = Item.class,
        resolver = EntityIdResolver.class
)
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"dispositivo_id", "fatura_id"})
})
public class Item extends AbstractEntity implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = -98765951648456159L;

    /**
     *
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "fatura_id")
    private Fatura fatura;

    /**
     *
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "dispositivo_id")
    private Dispositivo dispositivo;

    /**
     *
     */
    @Column
    private Integer avaliacoesExcedentes;

    /**
     * Total permitido
     */
    @Column
    private Integer totalAvaliacoes;

    /**
     *
     */
    public Item() {
    }

    /**
     * @param id Long
     */
    public Item(final Long id) {
        super(id);
    }

    /**
     * @return
     */
    public BigDecimal getPrecoComAcressimo() {
        return this.fatura.getValorMensal().add(this.getValorDeAcressimo());
    }

    /**
     * @return
     */
    public BigDecimal getValorDeAcressimo() {
        final BigDecimal preco;

        if (totalAvaliacoes != null && fatura != null && totalAvaliacoes > fatura.getQuantidadeMaximaAvaliacoes()) {
            avaliacoesExcedentes = totalAvaliacoes - fatura.getQuantidadeMaximaAvaliacoes();
            preco = fatura.getValorMensal().add(fatura.getValorAvaliacoesExcedentes().multiply(new BigDecimal(avaliacoesExcedentes)));
        } else preco = BigDecimal.ZERO;

        return preco;
    }

    /**
     * @param totalAvaliacoes
     */
    public void setTotalAvaliacoes(Integer totalAvaliacoes) {
        this.totalAvaliacoes = totalAvaliacoes;

        // Calcula preços
        this.getValorDeAcressimo();
    }
}
