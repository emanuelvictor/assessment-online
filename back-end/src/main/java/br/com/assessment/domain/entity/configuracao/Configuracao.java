package br.com.assessment.domain.entity.configuracao;

import br.com.assessment.domain.entity.generic.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import static br.com.assessment.application.context.Context.DEFAULT_TENANT_ID;

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
    private String um;

    /**
     *
     */
    private String dois;

    /**
     *
     */
    private String tres;

    /**
     *
     */
    private String quatro;

    /**
     *
     */
    private String cinco;

    /**
     *
     */
    @JsonIgnore
    private byte[] logo;

    /**
     *
     *
     */
    private String logoPath;

    /**
     *
     */
    @JsonIgnore
    private byte[] backgroundImage;

    /**
     *
     */
    private String backgroundImagePath;

    /**
     *
     */
    private String agradecimento;

}