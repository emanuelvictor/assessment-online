package br.com.ubest.domain.entity.configuracao;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

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
    public Boolean feedbackObrigatorio;

    /**
     *
     */
    @Enumerated(EnumType.ORDINAL)
    public TipoFeedback tipoFeedback = TipoFeedback.TEXTO;

    /**
     *
     */
    private boolean quebrarLinhaNaSelecaoDeItenAvaliavel;

    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    @Min(value = 5, message = "O mínimo são 5 segundos")
    @Max(value = 600, message = "O máximo são 10 minutos (600 segundos)")
    private short time;

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

    /**
     *
     * @return int
     */
    public int getTimeInMilis() {
        return time * 1000;
    }
}
