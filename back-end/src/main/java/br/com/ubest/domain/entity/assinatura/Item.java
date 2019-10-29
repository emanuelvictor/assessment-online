package br.com.ubest.domain.entity.assinatura;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import br.com.ubest.domain.entity.unidade.Dispositivo;
import br.com.ubest.domain.entity.unidade.Unidade;
import br.com.ubest.domain.entity.usuario.Perfil;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Collection;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Entity
@Audited
@EqualsAndHashCode(callSuper = true)
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
