package br.com.ubest.application.websocket;

import br.com.ubest.application.converters.JsonConverter;
import br.com.ubest.domain.entity.unidade.Dispositivo;
import br.com.ubest.domain.repository.DispositivoRepository;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import org.springframework.web.util.UriTemplate;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.UnicastProcessor;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public class DispositivoWebSocketHandler implements WebSocketHandler {

    private UnicastProcessor<Dispositivo> messagePublisher;
    private Flux<String> outputMessages;
    private DispositivoRepository dispositivoRepository;

    public DispositivoWebSocketHandler(final DispositivoRepository dispositivoRepository) {
        this.dispositivoRepository = dispositivoRepository;
    }

    // Cria o fluxo vazio
    public UnicastProcessor<Dispositivo> dispositivoPublisher(final long dispositivoId) {
        final Dispositivo dispositivo = this.dispositivoRepository.findById(dispositivoId).orElseThrow();
        return UnicastProcessor.create(new LinkedList<>(List.of(dispositivo)));
    }

    public Flux<Dispositivo> dispositivos(final UnicastProcessor<Dispositivo> dispositivoPublisher) {
        return dispositivoPublisher.replay(1).autoConnect();
    }

    @Override
    public Mono<Void> handle(final WebSocketSession session) {
        // Se as mensagens estão nulas, inicializa com o primeiro
        if (this.outputMessages == null) {
            this.messagePublisher = this.dispositivoPublisher(extractIdFromSession(session));
            this.outputMessages = Flux.from(this.dispositivos(this.messagePublisher)).map(new JsonConverter<Dispositivo>()::toJSON);
        }

        final WebSocketMessageSubscriber subscriber = new WebSocketMessageSubscriber(messagePublisher);
        session.receive()
                .map(WebSocketMessage::getPayloadAsText)
                // Recebendo salva
                .map(s -> {
                    final Dispositivo dispositivo = new JsonConverter<Dispositivo>().toObject(s, Dispositivo.class);
                    dispositivo.setId(extractIdFromSession(session));
                    return this.dispositivoRepository.save(dispositivo);
                })
                .subscribe(subscriber::onNext, subscriber::onError, subscriber::onComplete);

        // Envia o que está na base
        return session.send(outputMessages.map(session::textMessage));
    }

    /**
     *
     * @param session WebSocketSession
     * @return long
     */
    private static long extractIdFromSession(final WebSocketSession session) {
        // This can go in a static final
        final UriTemplate template = new UriTemplate("/dispositivos/{id}");
        final Map<String, String> parameters = template.match(session.getHandshakeInfo().getUri().toASCIIString());
        final String id = parameters.get("id");

        return Long.valueOf(id.replace("?encoding=text", ""));
    }
}
