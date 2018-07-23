package br.com.assessment.application.security;


import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.repository.UsuarioRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.server.WebFilterExchange;
import org.springframework.security.web.server.authentication.ServerAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.logging.Logger;


/**
 *
 */
@Component
public class AuthenticationSuccessHandler implements ServerAuthenticationSuccessHandler {

    /**
     *
     */
    private static final Logger LOG = Logger.getLogger(AuthenticationSuccessHandler.class.getName());

    /**
     *
     */
    private final UsuarioRepository usuarioRepository;

    /**
     *
     */
    private final ObjectMapper objMapper;

    /**
     *
     */
    public AuthenticationSuccessHandler(final UsuarioRepository usuarioRepository, final ObjectMapper objMapper) {
        this.usuarioRepository = usuarioRepository;
        this.objMapper = objMapper;
    }

    /**
     *
     */
    @Override
    public Mono<Void> onAuthenticationSuccess(final WebFilterExchange webFilterExchange, final  Authentication authentication) {
        final Usuario usuario;
        if (((Usuario) authentication.getPrincipal()).getUsername().equals(Usuario.MASTER_USER_EMAIL)) {
            usuario = (Usuario) Usuario.getMasterUser();
        } else {
            usuario = this.usuarioRepository.findById(((Usuario) authentication.getPrincipal()).getId()).get();
            usuario.setLastLogin(LocalDateTime.now());
            this.usuarioRepository.save(usuario);
        }

        try {
            final DataBuffer buf = webFilterExchange.getExchange().getResponse().bufferFactory().wrap(objMapper.writeValueAsBytes(usuario));
            webFilterExchange.getExchange().getResponse().setStatusCode(HttpStatus.OK);
            return webFilterExchange.getExchange().getResponse().writeWith(Mono.just(buf));
        } catch (final JsonProcessingException e) {
            LOG.severe(e.getMessage());
            e.printStackTrace();
            return Mono.error(e);
        }
    }
}