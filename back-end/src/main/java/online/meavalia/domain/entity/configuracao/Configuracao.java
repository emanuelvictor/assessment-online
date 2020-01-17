package online.meavalia.domain.entity.configuracao;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import online.meavalia.domain.entity.generic.AbstractEntity;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import java.io.Serializable;

/**
 * Created by Emanuel Victor on 15/03/2017.
 */
@Data
@Entity
@Audited
@EqualsAndHashCode(callSuper = true)
public class Configuracao extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -12345665432751632L;

    /*
     * --------------------------------------------------------------
     *            Configurações de nomes das avaliações
     * --------------------------------------------------------------
     */
    /**
     *
     */
    public Boolean feedbackObrigatorio;
    /**
     *
     */
    @Enumerated(EnumType.ORDINAL)
    public TipoFeedback tipoFeedback = TipoFeedback.TEXTO;
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
    /**
     *
     */
    private String feedbackEnunciado;
    /**
     *
     */
    private boolean feedback;
    /**
     *
     */
    private boolean quebrarLinhaNaSelecaoDeItenAvaliavel;

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
    public String getAgradecimento() {
        return agradecimento == null ? "Obrigado, agradecemos a participação" : agradecimento;
    }

    /**
     * @return String
     */
    public String getUm() {
        return um == null ? "Péssimo" : um;
    }

    /**
     * @return String
     */
    public String getDois() {
        return dois == null ? "Ruim" : dois;
    }

    /**
     * @return String
     */
    public String getTres() {
        return tres == null ? "Regular" : tres;
    }

    /**
     * @return String
     */
    public String getQuatro() {
        return quatro == null ? "Bom" : quatro;
    }

    /**
     * @return String
     */
    public String getCinco() {
        return cinco == null ? "Ótimo" : cinco;
    }

}
