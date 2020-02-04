package online.meavalia.application.aspect.exceptions;

/**
 *
 */
public class OverdueException extends RuntimeException {

    /**
     * @param message
     */
    public OverdueException(final String message) {
        super(message);
    }
}
