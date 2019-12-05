package online.meavalia.application.websocket;

import online.meavalia.domain.entity.generic.AbstractEntity;
import online.meavalia.infrastructure.converters.JsonConverter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import org.springframework.web.util.UriTemplate;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

public class GenericWebSocketHandler<T extends AbstractEntity> implements WebSocketHandler {

    // Path para extração do ID
    protected final String path;

    // Nome do parâmetro
    protected final String parameterName;

    // Mapeador do JSON
    protected JsonConverter<T> jsonConverter;

    // Repositório
    protected JpaRepository<T, Long> jpaRepository;

    // Envelopa os subscribers
    protected final List<WrapperHandler<T>> wrappersHandler;

    /**
     * @param jpaRepository JpaRepository<T, Long>
     * @param jsonConverter JsonConverter<T>
     * @param path          String
     */
    GenericWebSocketHandler(final JpaRepository<T, Long> jpaRepository, final JsonConverter<T> jsonConverter, final String path, final String parameterName, final List<WrapperHandler<T>> wrappersHandler) {
        this.jpaRepository = jpaRepository;
        this.jsonConverter = jsonConverter;
        this.path = path;
        this.parameterName = parameterName;
        this.wrappersHandler = wrappersHandler;
    }

    @Override
    public Mono<Void> handle(final WebSocketSession session) {

        final Object resourceId = extractParameterNameFromSession(session);

        final WrapperHandler<T> wrapperHandler = this.getWrapperHandlerByRosourceId(resourceId);

        final WebSocketMessageSubscriber<T> subscriber = new WebSocketMessageSubscriber<>(wrapperHandler.getMessagePublisher());

        session.receive()
                .map(WebSocketMessage::getPayloadAsText)
                // Recebendo salva
                .map(s -> {
                    final T entity = jsonConverter.toObject(s);
                    entity.setId((Long) extractParameterNameFromSession(session));
                    return this.jpaRepository.save(entity);
                })
                .subscribe(subscriber::onNext, subscriber::onError, () -> {
                    wrapperHandler.decrementSubscribers();
                    if (wrapperHandler.nonSubscribers())
                        removeWrapperHandlerByRosourceId((Long) resourceId);
                });

        // Envia o que está na base
        return session.send(wrapperHandler.getOutputMessages().map(session::textMessage));
    }

    /**
     * @param resourceId long
     * @return WrapperHandler<T>
     */
    private WrapperHandler<T> getWrapperHandlerByRosourceId(final Object resourceId) {
        if (wrappersHandler.stream().noneMatch(wh -> wh.getResourceId().equals(resourceId)))
            wrappersHandler.add(new WrapperHandler<>(jpaRepository.findById((Long)resourceId), jsonConverter, resourceId));
        return wrappersHandler.stream().filter(wh -> wh.getResourceId().equals(resourceId)).findFirst().orElseThrow();
    }

    /**
     * @param resourceId long
     */
    protected void removeWrapperHandlerByRosourceId(final Object resourceId) {
        wrappersHandler.removeIf(tWrapperHandler -> tWrapperHandler.getResourceId().equals(resourceId));
    }


    /**
     * @param session WebSocketSession
     * @return long
     */
    protected Object extractParameterNameFromSession(final WebSocketSession session) {
        // This can go in a static final
        final UriTemplate template = new UriTemplate(path);
        final Map<String, String> parameters = template.match(session.getHandshakeInfo().getUri().toASCIIString());
        final String id = parameters.get(this.parameterName);

        return Long.parseLong(id.replace("?encoding=text", ""));
    }

}
