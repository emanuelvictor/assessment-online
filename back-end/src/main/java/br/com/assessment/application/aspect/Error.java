package br.com.assessment.application.aspect;

/**
 * TODO deve ficar na infra
 * <p>
 * Entidade auxiliar utilizada para serializar os erros para o front-end
 */
public class Error {
    private String message;

    public Error() {
    }

    public Error(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}