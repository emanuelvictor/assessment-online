package online.meavalia.application.aspect.exceptions;

/**
 *
 */
public class AccessDeniedException extends RuntimeException {

    /**
     * @param message
     */
    public AccessDeniedException(final String message) {
        super(message);
    }
}
