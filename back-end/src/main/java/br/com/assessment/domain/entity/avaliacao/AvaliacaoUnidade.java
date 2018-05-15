package br.com.assessment.domain.entity.avaliacao;

import br.com.assessment.domain.entity.unidade.Unidade;

public class AvaliacaoUnidade {

    private Unidade unidade;

    private Avaliacao avaliacao;

    /**
     * Representa a ordem da avaliação no aplicativo na unidade. Representa a apresentação das avaliações em diferentes telas conforme a ordem.
     * Exemplo: Se a ordem se repetir, as avaliações serão agrupadas na mesma tela.
     */
    private short ordem;
}
