package br.com.ubest.application.websocket.generic;

import br.com.ubest.application.converters.JsonConverter;
import br.com.ubest.domain.entity.generic.AbstractEntity;
import org.springframework.data.jpa.repository.JpaRepository;
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

public class GenericWebSocketHandler<T extends AbstractEntity> implements WebSocketHandler {

    private UnicastProcessor<T> messagePublisher;
    private Flux<String> outputMessages;
    private JpaRepository<T, Long> jpaRepository;
    private JsonConverter<T> jsonConverter;

    public GenericWebSocketHandler(final JpaRepository<T, Long> jpaRepository, final JsonConverter<T> jsonConverter) {
        this.jpaRepository = jpaRepository;
        this.jsonConverter = jsonConverter;
    }

    // Cria o fluxo vazio
    public UnicastProcessor<T> publisher(final long id) {
        final T object = this.jpaRepository.findById(id).orElseThrow();
        return UnicastProcessor.create(new LinkedList<>(List.of(object)));
    }

    private Flux<T> flux(final UnicastProcessor<T> publisher) {
        return publisher.replay(1).autoConnect();
    }

    @Override
    public Mono<Void> handle(final WebSocketSession session) {
        // Se as mensagens estão nulas, inicializa com o primeiro
        if (this.outputMessages == null) {
            this.messagePublisher = this.publisher(extractIdFromSession(session));
            this.outputMessages = Flux.from(this.flux(this.messagePublisher)).map(entity -> jsonConverter.toJSON(entity));
        }

        final WebSocketMessageSubscriber<T> subscriber = new WebSocketMessageSubscriber<>(messagePublisher);
        session.receive()
                .map(WebSocketMessage::getPayloadAsText)
                // Recebendo salva
                .map(s -> {
                    final T abstractEntity = jsonConverter.toObject(s);
                    abstractEntity.setId(extractIdFromSession(session));
                    return this.jpaRepository.save(abstractEntity);
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
        final UriTemplate template = new UriTemplate("/tipos-avaliacoes/{id}");
        final Map<String, String> parameters = template.match(session.getHandshakeInfo().getUri().toASCIIString());
        final String id = parameters.get("id");

        return Long.parseLong(id.replace("?encoding=text", ""));
    }
}
