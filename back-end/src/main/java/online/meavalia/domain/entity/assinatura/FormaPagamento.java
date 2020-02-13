package online.meavalia.domain.entity.assinatura;


/**
 * @author Emanuel Victor
 * @version 1.0.0
 * @since 1.0.0, 10/09/2019
 */
public enum FormaPagamento {

    /**
     *
     */
    BOLETO(0),

    /**
     *
     */
    CARTAO(1);

    /**
     *
     */
    public final int formaPagamento;

    /**
     * @param formaPagamento
     */
    FormaPagamento(final int formaPagamento) {
        this.formaPagamento = formaPagamento;
    }
}
