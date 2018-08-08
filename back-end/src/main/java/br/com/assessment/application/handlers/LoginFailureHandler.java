package br.com.assessment.application.handlers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.server.WebFilterExchange;
import org.springframework.security.web.server.authentication.ServerAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.logging.Logger;

/**
 *
 */
@Component
@AllArgsConstructor
public class LoginFailureHandler implements ServerAuthenticationFailureHandler {

    /**
     *
     */
    private static final Logger LOG = Logger.getLogger(LoginFailureHandler.class.getName());

    /**
     *
     */
    private final ObjectMapper objMapper;

    /**
     *
     */
    @Override
    public Mono<Void> onAuthenticationFailure(WebFilterExchange webFilterExchange, AuthenticationException exception) {

        try {
            final DataBuffer buf;

            if (exception instanceof BadCredentialsException) {
                buf = webFilterExchange.getExchange().getResponse().bufferFactory().wrap(objMapper.writeValueAsBytes("Nome de usuário ou senha não conferem"));
                webFilterExchange.getExchange().getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            } else if (exception instanceof LockedException || exception instanceof DisabledException) {
                buf = webFilterExchange.getExchange().getResponse().bufferFactory().wrap(objMapper.writeValueAsBytes("Nome de usuário ou senha não conferem"));
                webFilterExchange.getExchange().getResponse().setStatusCode(HttpStatus.FORBIDDEN);
            } else if (exception instanceof CredentialsExpiredException) {
                buf = webFilterExchange.getExchange().getResponse().bufferFactory().wrap(objMapper.writeValueAsBytes("Senha de usuário está expirada"));
                webFilterExchange.getExchange().getResponse().setStatusCode(HttpStatus.NOT_ACCEPTABLE);
            } else if (exception instanceof InternalAuthenticationServiceException) {
                buf = webFilterExchange.getExchange().getResponse().bufferFactory().wrap(objMapper.writeValueAsBytes("Login não encontrado"));
                webFilterExchange.getExchange().getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            } else {
                buf = webFilterExchange.getExchange().getResponse().bufferFactory().wrap(objMapper.writeValueAsBytes("Ocorreu um erro interno"));
                webFilterExchange.getExchange().getResponse().setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
            }

            return webFilterExchange.getExchange().getResponse().writeWith(Mono.just(buf));

        } catch (JsonProcessingException e) {
            LOG.severe(e.getMessage());
            e.printStackTrace();
            return Mono.error(e);
        }
    }
}