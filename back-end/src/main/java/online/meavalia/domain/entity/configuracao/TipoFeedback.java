package online.meavalia.domain.entity.configuracao;

public enum TipoFeedback {

    /**
     *
     */
    TEXTO(0),

    /**
     *
     */
    EMAIL(1),

    /**
     *
     */
    CPF(2),

    /**
     *
     */
    TELEFONE(3);

    /**
     *
     */
    public final int tipoFeedback;

    /**
     * @param tipoFeedback
     */
    TipoFeedback(final int tipoFeedback) {
        this.tipoFeedback = tipoFeedback;
    }
}
