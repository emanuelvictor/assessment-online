package br.com.assessment.application.security;


import br.com.assessment.application.context.ContextHolder;
import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.repository.UsuarioRepository;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.server.WebFilterExchange;
import org.springframework.security.web.server.authentication.RedirectServerAuthenticationSuccessHandler;
import org.springframework.security.web.server.authentication.ServerAuthenticationFailureHandler;
import org.springframework.security.web.server.authentication.ServerAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Calendar;
import java.util.logging.Logger;


/**
 *
 */
@Component
public class AuthenticationSuccessHandler implements ServerAuthenticationSuccessHandler {
    private static final Logger LOG = Logger.getLogger(AuthenticationSuccessHandler.class.getName());

    /**
     *
     */
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    ObjectMapper objMapper;
//
//    /**
//     *
//     */
//    public AuthenticationSuccessHandler() {
//        super();
////        setRedirectStrategy((exchange, location) -> {});
//    }
//
//
//
//    /* (non-Javadoc)
//     * @see org.springframework.security.web.authentication.AuthenticationSuccessHandler#onAuthenticationSuccess(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, org.springframework.security.core.Authentication)
//     */
//    @Override
//    public void onAuthenticationSuccess(WebFilterExchange webFilterExchange,
//                                        Authentication authentication) throws IOException, ServletException {
//        try {
//
//            final Usuario usuario;
//            if (ContextHolder.getAuthenticatedUser().getUsername().equals(Usuario.MASTER_USERNAME)) {
//                usuario = Usuario.getMasterUser();
//            } else {
//                usuario = this.usuarioRepository.findOne(ContextHolder.getAuthenticatedUser().getId());
//                usuario.setLastLogin(Calendar.getInstance());
//                this.usuarioRepository.save(usuario);
//            }
//
//            response.setCharacterEncoding("UTF8"); // this line solves the problem
//            response.setContentType("application/json");
//            usuario.setPassword(null);
//            response.getWriter().write(new Gson().toJson(usuario)); //TODO Não converte os getters
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            LOG.severe("Ocorreu um problema ao atualizar o ultimo login do usuário");
//        }
//    }

    @Override
    public Mono<Void> onAuthenticationSuccess(WebFilterExchange webFilterExchange, Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        if (usuario.getUsername().equals(Usuario.MASTER_USER_EMAIL)) {
            usuario = (Usuario) Usuario.getMasterUser(); //TODO;
        } else {
            usuario = this.usuarioRepository.findById(usuario.getId()).get();
            usuario.setLastLogin(Calendar.getInstance());
            this.usuarioRepository.save(usuario);
        }

        try {
            final DataBuffer buf = webFilterExchange.getExchange().getResponse().bufferFactory().wrap(objMapper.writeValueAsBytes(usuario));
            webFilterExchange.getExchange().getResponse().setStatusCode(HttpStatus.OK);
            return webFilterExchange.getExchange().getResponse().writeWith(Mono.just(buf));
        } catch (final JsonProcessingException e) {
            e.printStackTrace();
        }
        return Mono.empty();
    }
}