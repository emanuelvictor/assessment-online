package br.com.ubest.domain.entity.assinatura;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import br.com.ubest.domain.entity.generic.EntityIdResolver;
import br.com.ubest.domain.entity.unidade.Dispositivo;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Data;
import lombok.EqualsAndHashCode;
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
    private BigDecimal preco;

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

}
