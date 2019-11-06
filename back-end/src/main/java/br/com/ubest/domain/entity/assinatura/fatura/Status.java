package br.com.ubest.domain.entity.assinatura.fatura;


/**
 * @author Emanuel Victor
 * @version 1.0.0
 * @since 1.0.0, 10/09/2019
 */
public enum Status {

    //   TANTO PARA PAGAMENTO OU PEDIDO. Primeiro evento de um pagamento ou pedido, indica que o mesmo foi criado. TODO não precisa
    CREATED,

    // PAGAMENTO    Atualização de status para Aguardando, indica que a Wirecard está aguardando confirmação de pagamento.
    // PEDIDO    Pedido aguardando confirmação de pagamento. Indica que há um pagamento de cartão em análise ou um boleto que ainda não foi confirmado pelo banco.
    WAITING,

    //    Status Em Análise, indica que o pagamento está passando por uma análise de risco dentro da Wirecard, podendo ser automática ou manual. TODO não precisa
    IN_ANALYSIS,

    //    Pré-autorizado: esse status indica a reserva do valor do pagamento no cartão do cliente.
    //    Após a pré-autorização é possível fazer a captura em até 5 dias.
    //    Passado esse período a Wirecard cancelará a transação automaticamente.
    PRE_AUTHORIZED,

    //    Atualização de status para Autorizado, significa que o pagamento foi capturado e debitado no cartão do cliente ou reconhecido junto a instituição bancária,
    //    esse status é o indicador de que o pagamento foi efetivado e você deve proceder com a entrega da compra.
    AUTHORIZED,

    //    Pagamento Cancelado(Pagamentos com cartão podem ser cancelados pela Wirecard ou pelo emissor do cartão, boletos são cancelados 5 dias após vencimento, débito bancário é cancelado em caso de falha).
    CANCELLED,

    //    Pagamento reembolsado(quem processa reembolsos são Wirecard e/ou Merchant).
    REFUNDED,

    //    Atualização de status de pagamento para Estornado(o estorno é a contestação do pagamento feita pelo comprador direto na operadora de cartão, como por exemplo pelo motivo de não reconhecimento do pagamento em sua fatura).
    REVERSED,

    //    Atualização de status de pagamento para Concluído, valor disponível para transferência em conta bancária(saque). TODO não precisa
    SETTLED,

    // Pedido pago. O pagamento criado nesse pedido foi autorizado.
    PAID,

    // Pedido não pago. O pagamento criado nesse pedido foi cancelado(Pagamentos com cartão podem ser cancelados pela Wirecard ou pelo emissor do cartão, boletos são cancelados 5 dias após vencimento, débito bancário é cancelado em caso de falha).
    NOT_PAID,

    // Pedido revertido. Sofreu um chargeback ou foi completamente reembolsado.
    REVERTED

}
