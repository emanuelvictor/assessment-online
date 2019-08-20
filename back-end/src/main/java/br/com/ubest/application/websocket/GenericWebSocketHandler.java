package br.com.ubest.application.websocket;

import br.com.ubest.application.converters.JsonConverter;
import br.com.ubest.domain.entity.generic.AbstractEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import org.springframework.web.util.UriTemplate;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

public class GenericWebSocketHandler<T extends AbstractEntity> implements WebSocketHandler {

    // Envelopa os subscribers
    private final List<WrapperHandler<T>> wrappersHandler;

    // Repositório
    private JpaRepository<T, Long> jpaRepository;

    // Mapeador do JSON
    private JsonConverter<T> jsonConverter;

    // Path para extração do ID
    private final String path;

    /**
     * @param jpaRepository JpaRepository<T, Long>
     * @param jsonConverter JsonConverter<T>
     * @param path          String
     */
    GenericWebSocketHandler(final JpaRepository<T, Long> jpaRepository, final JsonConverter<T> jsonConverter, final String path, final List<WrapperHandler<T>> wrappersHandler) {
        this.jpaRepository = jpaRepository;
        this.jsonConverter = jsonConverter;
        this.path = path;
        this.wrappersHandler = wrappersHandler;
    }

    @Override
    public Mono<Void> handle(final WebSocketSession session) {

        final long resourceId = extractIdFromSession(session);

        final WrapperHandler<T> wrapperHandler = this.getWrapperHandlerByRosourceId(resourceId);

        final WebSocketMessageSubscriber<T> subscriber = new WebSocketMessageSubscriber<>(wrapperHandler.getMessagePublisher());

        session.receive()
                .map(WebSocketMessage::getPayloadAsText)
                // Recebendo salva
                .map(s -> {
                    final T abstractEntity = jsonConverter.toObject(s);
                    abstractEntity.setId(extractIdFromSession(session));
                    return this.jpaRepository.save(abstractEntity);
                })
                .subscribe(subscriber::onNext, subscriber::onError, () -> {
                    wrapperHandler.decrementSubscribers();
                    if (wrapperHandler.nonSubscribers())
                        removeWrapperHandlerByRosourceId(resourceId);
                });

        // Envia o que está na base
        return session.send(wrapperHandler.getOutputMessages().map(session::textMessage));
    }

    /**
     * @param resourceId long
     * @return WrapperHandler<T>
     */
    private WrapperHandler<T> getWrapperHandlerByRosourceId(final long resourceId) {
        if (wrappersHandler.stream().noneMatch(wh -> wh.getResourceId() == resourceId))
            wrappersHandler.add(new WrapperHandler<>(jpaRepository, jsonConverter, resourceId));
        return wrappersHandler.stream().filter(wh -> wh.getResourceId() == resourceId).findFirst().orElseThrow();
    }

    /**
     * @param resourceId long
     */
    private void removeWrapperHandlerByRosourceId(final long resourceId) {
        wrappersHandler.removeIf(tWrapperHandler -> tWrapperHandler.getResourceId() == resourceId);
    }


    /**
     * @param session WebSocketSession
     * @return long
     */
    private long extractIdFromSession(final WebSocketSession session) {
        // This can go in a static final
        final UriTemplate template = new UriTemplate(path);
        final Map<String, String> parameters = template.match(session.getHandshakeInfo().getUri().toASCIIString());
        final String id = parameters.get("id");

        return Long.parseLong(id.replace("?encoding=text", ""));
    }
}
