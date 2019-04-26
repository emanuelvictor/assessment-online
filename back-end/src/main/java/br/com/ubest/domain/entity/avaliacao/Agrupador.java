package br.com.ubest.domain.entity.avaliacao;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.envers.Audited;

import javax.persistence.Column;
import javax.persistence.Entity;

@Data
@Entity
@Audited
@NoArgsConstructor
@lombok.EqualsAndHashCode(callSuper = true)
public class Agrupador extends AbstractEntity {

//    @OneToMany(targetEntity = Avaliacao.class, mappedBy = "agrupador", fetch = FetchType.EAGER, orphanRemoval = true)
//    public List<Avaliacao> avaliacoes;

    @Column(length = 300)
    private String feedback;

}
