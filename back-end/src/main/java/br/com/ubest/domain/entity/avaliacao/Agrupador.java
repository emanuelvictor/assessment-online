package br.com.ubest.domain.entity.avaliacao;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.envers.Audited;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Transient;
import java.io.Serializable;
import java.util.List;

@Data
@Entity
@Audited
@NoArgsConstructor
@lombok.EqualsAndHashCode(callSuper = true)
public class Agrupador extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -2224100332065317651L;

    /**
     * todo NÃO ROLOU, muitos dados
     */
    @Transient
    public List<Avaliacao> avaliacoes;

    /**
     *
     */
    @Transient
    private String recap;

    /**
     *
     */
    @Column(length = 300)
    private String feedback;

}
