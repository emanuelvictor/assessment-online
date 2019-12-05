package online.meavalia.application.handlers;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.server.WebFilterExchange;
import org.springframework.security.web.server.authentication.logout.ServerLogoutSuccessHandler;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.logging.Logger;


/**
 *
 */
@Component
@AllArgsConstructor
public class LogoutSuccessHandler implements ServerLogoutSuccessHandler {

    /**
     *
     */
    private final ObjectMapper objMapper;

//    private final ReactiveSessionRepository<Sessao> reactiveSessionRepository;

    /**
     *
     */
    private static final Logger LOG = Logger.getLogger(LogoutSuccessHandler.class.getName());

    /**
     * @param webFilterExchange {WebFilterExchange}
     * @param authentication    {Authentication}
     * @return Mono<Void>
     */
    @Override
    public Mono<Void> onLogoutSuccess(final WebFilterExchange webFilterExchange, final Authentication authentication) {

        try {
            final DataBuffer buf = webFilterExchange.getExchange().getResponse().bufferFactory().wrap(objMapper.writeValueAsBytes("Logout efetuado com sucesso"));
            webFilterExchange.getExchange().getResponse().setStatusCode(HttpStatus.OK);

//            // Deleta a sessão da base
//            final Session session = reactiveSessionRepository.findById(webFilterExchange.getExchange().getRequest().getCookies().get(TOKEN_NAME).get(0).getValue()).block();
//            reactiveSessionRepository.deleteById(session.getId());

            return webFilterExchange.getExchange().getResponse().writeWith(Mono.just(buf));
        } catch (final JsonProcessingException e) {
            LOG.severe(e.getMessage());
            e.printStackTrace();
            return Mono.error(e);
        }
    }
}
