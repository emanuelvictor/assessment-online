package br.com.ubest.domain.entity.avaliacao;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import br.com.ubest.domain.entity.generic.EntityIdResolver;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Data
@Entity
@Audited
@NoArgsConstructor
@lombok.EqualsAndHashCode(callSuper = true)
public class Agrupador extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -2224100332065317651L;


    // todo NÃO ROLOU, muitos dados
    @Transient
    public List<Avaliacao> avaliacoes;

    @Column(length = 300)
    private String feedback;

}
