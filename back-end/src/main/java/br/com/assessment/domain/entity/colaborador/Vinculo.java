package br.com.assessment.domain.entity.colaborador;

public enum Vinculo {
    Atendente, // 0
    Operador, // 1
    OperadorAtendente, // 2
    Nenhum; // 3

    public static final long ATENDENTE_VALUE = 0;
    public static final long OPERADOR_VALUE = 1;
    public static final long OPERADOR_ATENDENTE_VALUE = 2;
    public static final long NENHUM_VALUE = 3;
}
