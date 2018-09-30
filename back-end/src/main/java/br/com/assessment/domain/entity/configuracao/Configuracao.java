package br.com.assessment.domain.entity.configuracao;

import br.com.assessment.domain.entity.generic.AbstractEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;

/**
 * Created by Emanuel Victor on 15/03/2017.
 */
@Data
@Entity
@Audited
@EqualsAndHashCode(callSuper = true)
public class Configuracao extends AbstractEntity {

    /*
     * --------------------------------------------------------------
     *            Configurações de nomes das avaliações
     * --------------------------------------------------------------
     */

    /**
     *
     */
    public String um;

    /**
     *
     */
    public String dois;

    /**
     *
     */
    public String tres;

    /**
     *
     */
    public String quatro;

    /**
     *
     */
    public String cinco;

}