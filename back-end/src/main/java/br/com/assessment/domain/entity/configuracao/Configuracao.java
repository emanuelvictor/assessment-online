package br.com.assessment.domain.entity.configuracao;

import br.com.assessment.domain.entity.generic.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private String agradecimentoDefault;

    /**
     * @return byte[]
     */
    @JsonIgnore
    public byte[] getLogoFile() {
        return this.logo;
    }

    /**
     * @return byte[]
     */
    @JsonIgnore
    public byte[] getBackgroundImageFile() {
        return this.backgroundImage;
    }

    /**
     * @return byte[]
     */
    public String getLogoPath() {
        if (this.logo != null)
            return "./configuracoes/logomarca";
        return null;
    }

    /**
     * @return byte[]
     */
    public String getBackgroundImagePath() {
        if (this.backgroundImage != null)
            return "./configuracoes/background";
        return null;
    }

    /**
     * @return String
     */
    public String getAgradecimentoDefault() {
        return agradecimentoDefault == null ? "Obrigado, agradecemos a participação" : agradecimentoDefault;
    }
}