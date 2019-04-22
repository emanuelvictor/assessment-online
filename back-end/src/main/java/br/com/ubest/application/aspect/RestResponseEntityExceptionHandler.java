package br.com.ubest.application.aspect;

import br.com.ubest.application.aspect.exceptions.PasswordNotFound;
import br.com.ubest.application.aspect.handler.ResponseEntityExceptionHandler;
import lombok.RequiredArgsConstructor;
import org.hibernate.exception.ConstraintViolationException;
import org.postgresql.util.PSQLException;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.validation.ConstraintViolation;
import java.util.logging.Logger;

@RestControllerAdvice
@RequiredArgsConstructor
public class RestResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

    /**
     *
     */
    private static final Logger LOGGER = Logger.getLogger(RestResponseEntityExceptionHandler.class.getName());

    /**
     *
     */
    private final MessageSource messageSource;

    /**
     * Trata exceções de Constraint geradas pelo PostgreSQL
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleException(final org.springframework.dao.DataIntegrityViolationException exception) {
        String message = this.messageSource.getMessage("repository.dataIntegrityViolation", null, LocaleContextHolder.getLocale());

        final Error error = new Error();

        if (exception.getCause() instanceof ConstraintViolationException) {
            final ConstraintViolationException cause = (ConstraintViolationException) exception.getCause();
            final PSQLException sqlException = (PSQLException) cause.getSQLException();

            final String detail = sqlException.getServerErrorMessage().getDetail();

            String key;
            //Verifica o código do erro gerado pelo PostgreSQL
            switch (cause.getSQLState()) {
                case "23503": {
                    key = detail.substring(detail.indexOf('"'), detail.indexOf('.'));
                    Object[] args = new Object[]{key};
                    message = this.messageSource.getMessage("repository.foreignKeyViolation", args, LocaleContextHolder.getLocale()); //= this.messageSource.getMessage("repository.foreignKeyViolation", new String[]{key}, LocaleContextHolder.getLocale());

                    break;
                }
                case "23505": {
                    key = detail.substring(detail.indexOf('(') + 1, detail.indexOf(')'));
                    if (key.startsWith("lower(")) {
                        key = key.replace("lower(", "");
                        key = key.replace("::text", "");
                    }
                    Object[] args = new Object[]{key};

                    message = this.messageSource.getMessage("repository.uniqueViolation", args, LocaleContextHolder.getLocale()); //message = this.messageSource.getMessage("repository.uniqueViolation", new String[]{key}, LocaleContextHolder.getLocale());

                    break;
                }
                case "23502": //violação de nulidade
                    message = this.messageSource.getMessage("repository.fieldMustbeSet", new String[]{cause.getConstraintName()}, LocaleContextHolder.getLocale());

                    break;
                default:
                    message = this.messageSource.getMessage("repository.uniqueViolation", null, LocaleContextHolder.getLocale()); //message = this.messageSource.getMessage("repository.uniqueViolation", new String[]{cause.getSQLState()}, LocaleContextHolder.getLocale());

                    break;
            }
        }

        error.setMessage(message);
        return handleExceptionInternal(new Exception(message), error, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Trata exceções geradas pelo Hibernate antes de enviar para o banco
     */
    @ExceptionHandler(javax.validation.ConstraintViolationException.class)
    public ResponseEntity<Object> handleException(final javax.validation.ConstraintViolationException exception) {
        final StringBuilder message = new StringBuilder();
        for (ConstraintViolation<?> constraint : exception.getConstraintViolations()) {
            final String annotationType = constraint.getConstraintDescriptor().getAnnotation().annotationType().getName();

            //Verifica o tipo da exceção
            if (annotationType.equals("javax.validation.constraints.NotNull") || annotationType.equals("org.hibernate.validator.constraints.NotEmpty")) {
                message.append("\nO campo ").append(constraint.getPropertyPath()).append(" deve ser setado.");
            } else message.append("\n").append(constraint.getMessage());
        }

        return handleExceptionInternal(new Exception(message.toString()), new Error(message.toString()), new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     *
     */
    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<Object> handleException(final DuplicateKeyException exception) {
        final String message = this.messageSource.getMessage("repository.duplicatedKey", null, LocaleContextHolder.getLocale());
        return handleExceptionInternal(exception, new Error(message), new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     *
     */
    @ExceptionHandler(org.springframework.dao.EmptyResultDataAccessException.class)
    public ResponseEntity<Object> handleException(final org.springframework.dao.EmptyResultDataAccessException exception) {
        final String message = messageSource.getMessage("repository.emptyResult", null, LocaleContextHolder.getLocale());
        return handleExceptionInternal(exception, new Error(message), new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Trata exceções de acesso negado
     */
    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<Object> handleException(final org.springframework.security.access.AccessDeniedException exception) {
        return handleExceptionInternal(exception, new Error(this.messageSource.getMessage("security.accessDenied", null, LocaleContextHolder.getLocale())), new HttpHeaders(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(PasswordNotFound.class)
    public ResponseEntity<Object> handleException(final PasswordNotFound exception) {
        return handleExceptionInternal(exception, new Error(this.messageSource.getMessage("security.passwordNotFound", null, LocaleContextHolder.getLocale())), new HttpHeaders(), HttpStatus.FORBIDDEN);
    }

}
