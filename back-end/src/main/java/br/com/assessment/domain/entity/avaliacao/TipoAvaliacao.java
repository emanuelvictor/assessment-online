package br.com.assessment.domain.entity.avaliacao;

import br.com.assessment.domain.entity.generic.AbstractEntity;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.Column;
import javax.persistence.Entity;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
public class TipoAvaliacao extends AbstractEntity {

    @Column(nullable = false, unique = true)
    private String nome;

    @Column(nullable = false)
    private String enunciado;

    @Column(nullable = false)
    private String selecao;

    private String um;

    private String dois;

    private String tres;

    private String quatro;

    private String cinco;

}
