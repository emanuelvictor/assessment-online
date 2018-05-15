package br.com.assessment.domain.entity.avaliacao;

public class Resposta {

    /**
     * Equivale ao valor da resposta
     */
    private String valor;


    /**
     * Representa a ordem da resposta na avaliação.
     * Exemplo: Se a resposta tiver a ordem '0' e for o valor 'Ruim', esta resposta irá aparecer antes das demais com o valor de ordem maior que 0.
     * Obs:. A cor das respostas muda conforme o valor da ordem. Se houver valores iguais, as cores serão iguais.
     */
    private short ordem;
}
