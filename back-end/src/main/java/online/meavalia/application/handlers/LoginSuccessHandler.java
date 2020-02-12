package online.meavalia.application.handlers;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import online.meavalia.domain.entity.usuario.Conta;
import online.meavalia.domain.repository.ContaRepository;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.server.WebFilterExchange;
import org.springframework.security.web.server.authentication.ServerAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.logging.Logger;


/**
 *
 */
@Component
@RequiredArgsConstructor
public class LoginSuccessHandler implements ServerAuthenticationSuccessHandler {

    /**
     *
     */
    private static final Logger LOG = Logger.getLogger(LoginSuccessHandler.class.getName());

    /**
     *
     */
    private final ContaRepository contaRepository;

    /**
     *
     */
    private final ObjectMapper objMapper;

    /**
     * @param webFilterExchange {WebFilterExchange}
     * @param authentication    {Authentication}
     * @return Mono<Void>
     */
    @Override
    public Mono<Void> onAuthenticationSuccess(final WebFilterExchange webFilterExchange, final Authentication authentication) {

        final Conta conta = this.contaRepository.findById(((Conta) authentication.getPrincipal()).getId()).orElse(null);
        assert conta != null;
        conta.setLastLogin(LocalDateTime.now());
        this.contaRepository.save(conta);

        try {
            final DataBuffer buf = webFilterExchange.getExchange().getResponse().bufferFactory().wrap(objMapper.writeValueAsBytes(conta));
            webFilterExchange.getExchange().getResponse().setStatusCode(HttpStatus.OK);
            return webFilterExchange.getExchange().getResponse().writeWith(Mono.just(buf));
        } catch (final JsonProcessingException e) {
            LOG.severe(e.getMessage());
            e.printStackTrace();
            return Mono.error(e);
        }
    }
}
