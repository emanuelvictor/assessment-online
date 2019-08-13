package br.com.ubest.application.websocket;

import br.com.ubest.domain.entity.avaliacao.TipoAvaliacao;
import br.com.ubest.domain.entity.unidade.Dispositivo;
import br.com.ubest.domain.repository.DispositivoRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import org.springframework.web.util.UriTemplate;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.UnicastProcessor;

import javax.websocket.DeploymentException;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;

//@Component
//@RequiredArgsConstructor
public class DispositivoWebSocketHandler implements WebSocketHandler {

//    private final DispositivoRepository dispositivoRepository;

    @Override
    public Mono<Void> handle(WebSocketSession session) {

        // This can go in a static final
        final UriTemplate template = new UriTemplate("/echo/{id}");
        final Map<String, String> parameters = template.match(session.getHandshakeInfo().getUri().toASCIIString());
        final String id = parameters.get("id");

//        final Dispositivo dispositivo = dispositivoRepository.findById(Long.valueOf(id)).orElse(null);
//        if (dispositivo == null)
//            return session.close();

        return session
                .send(session.receive()
                        .map(msg -> "RECEIVED ON SERVER :: " + msg.getPayloadAsText())
                        .map(session::textMessage)
                );
    }
}
