package br.com.assessment.application.handlers;


import br.com.assessment.application.context.LocalContext;
import br.com.assessment.domain.entity.usuario.Sessao;
import br.com.assessment.domain.repository.SessaoRepository;
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

import static br.com.assessment.application.security.WebSessionServerSecurityContextRepository.TOKEN_NAME;


/**
 *
 */
@Component
@AllArgsConstructor
public class LogoutSuccessHandler implements ServerLogoutSuccessHandler {

    /**
     *
     */
    private static final Logger LOG = Logger.getLogger(LogoutSuccessHandler.class.getName());

    /**
     *
     */
    private final SessaoRepository sessaoRepository;

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
    public Mono<Void> onLogoutSuccess(final WebFilterExchange webFilterExchange, final Authentication authentication) {

        // Limpa o tenant
        LocalContext.clearCurrentSchema();
        LocalContext.clearCurrentUsername();

        try {
            final DataBuffer buf = webFilterExchange.getExchange().getResponse().bufferFactory().wrap(objMapper.writeValueAsBytes("Logout efetuado com sucesso"));
            webFilterExchange.getExchange().getResponse().setStatusCode(HttpStatus.OK);

            // Deleta a sessão da base
            final Sessao sessao = sessaoRepository.findByToken(webFilterExchange.getExchange().getRequest().getCookies().get(TOKEN_NAME).get(0).getValue());
            sessaoRepository.deleteById(sessao.getId());

            return webFilterExchange.getExchange().getResponse().writeWith(Mono.just(buf));
        } catch (final JsonProcessingException e) {
            LOG.severe(e.getMessage());
            e.printStackTrace();
            return Mono.error(e);
        }
    }
}