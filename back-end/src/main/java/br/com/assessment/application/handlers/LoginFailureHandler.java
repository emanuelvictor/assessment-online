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

//    /**
//     *
//     */
//    private final ObjectMapper objMapper;

    /**
     *
     */
    @Override
    public Mono<Void> onAuthenticationFailure(WebFilterExchange webFilterExchange, AuthenticationException exception) {

//        try {
//            final DataBuffer buf;
//            final br.com.assessment.application.aspect.Error error = new br.com.assessment.application.aspect.Error();
//            if (exception instanceof BadCredentialsException) {
//                error.setMessage("Nome de usuário ou senha não conferem");
//                buf = webFilterExchange.getExchange().getResponse().bufferFactory().wrap(objMapper.writeValueAsBytes(error));
//                webFilterExchange.getExchange().getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
//            } else if (exception instanceof LockedException || exception instanceof DisabledException) {
//                error.setMessage("Nome de usuário ou senha não conferem");
//                buf = webFilterExchange.getExchange().getResponse().bufferFactory().wrap(objMapper.writeValueAsBytes(error));
//                webFilterExchange.getExchange().getResponse().setStatusCode(HttpStatus.FORBIDDEN);
//            } else if (exception instanceof CredentialsExpiredException) {
//                error.setMessage("Senha de usuário está expirada");
//                buf = webFilterExchange.getExchange().getResponse().bufferFactory().wrap(objMapper.writeValueAsBytes(error));
//                webFilterExchange.getExchange().getResponse().setStatusCode(HttpStatus.NOT_ACCEPTABLE);
//            } else if (exception instanceof InternalAuthenticationServiceException) {
//                error.setMessage("Login não encontrado");
//                buf = webFilterExchange.getExchange().getResponse().bufferFactory().wrap(objMapper.writeValueAsBytes(error));
//                webFilterExchange.getExchange().getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
//            } else {
//                error.setMessage("Ocorreu um erro interno");
//                buf = webFilterExchange.getExchange().getResponse().bufferFactory().wrap(objMapper.writeValueAsBytes(error));
//                webFilterExchange.getExchange().getResponse().setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
//            }
//
//            return webFilterExchange.getExchange().getResponse().writeWith(Mono.just(buf));
//
//        } catch (JsonProcessingException e) {
//            LOG.severe(e.getMessage());
//            e.printStackTrace();
//            return Mono.error(e);
//        }
        return null;
    }
}