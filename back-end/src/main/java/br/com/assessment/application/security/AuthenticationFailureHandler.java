package br.com.assessment.application.security;

import br.com.assessment.domain.entity.usuario.Usuario;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.reactivestreams.Publisher;
import org.reactivestreams.Subscriber;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.server.WebFilterExchange;
import reactor.core.publisher.Mono;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 *
 */
public class AuthenticationFailureHandler //implements org.springframework.security.web.server.authentication.ServerAuthenticationFailureHandler
{
//    /*
//     * (non-Javadoc)
//     * @see org.springframework.security.web.authentication.AuthenticationFailureHandler#onAuthenticationFailure(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, org.springframework.security.core.AuthenticationException)
//     */
//    @Override
//    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
//        if (exception instanceof BadCredentialsException) {
//            response.setContentType("text/plain; charset=iso-8859-1");
//            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Nome de usuário ou senha não conferem");
//            throw new BadCredentialsException("Nome de usuário ou senha não conferem");
//        }
//
//        if (exception instanceof LockedException || exception instanceof DisabledException) {
//            response.setContentType("text/plain; charset=iso-8859-1");
//            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Este usuário está bloqueado");
//            throw new LockedException("Nome de usuário ou senha não conferem");
//        }
//
//        // lança excessao caso a senha esteja expirada
//        if (exception instanceof CredentialsExpiredException) {
//            response.setContentType("text/plain; charset=iso-8859-1");
//            response.sendError(HttpServletResponse.SC_NOT_ACCEPTABLE, "Senha de usuário está expirada");
//            throw new CredentialsExpiredException("Nome de usuário ou senha não conferem");
//        }
//
//        if (exception instanceof InternalAuthenticationServiceException) {
//            response.setContentType("text/plain; charset=iso-8859-1");
//            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Login não encontrado");
//            throw new InternalAuthenticationServiceException("Login não encontrado");
//        }
//
//        throw exception;
//    }
//
////    @Autowired
////    ObjectMapper objMapper;
//
//    @Override
//    public Mono<Void> onAuthenticationFailure(WebFilterExchange webFilterExchange, AuthenticationException exception) {
//        DataBuffer buf =  webFilterExchange.getExchange().getResponse().bufferFactory().wrap(objMapper.writeValueAsBytes(new Usuario()));;
//        webFilterExchange.getExchange().getResponse().setStatusCode(HttpStatus.OK);
//        return webFilterExchange.getExchange().getResponse().writeWith(Mono.just(buf));
//    }
}