package com.emanuelvictor.application.websocket;

import com.emanuelvictor.domain.entity.user.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.UnicastProcessor;

import java.io.IOException;

@Component
public class UserWebSocketHandler implements WebSocketHandler {

    private final ObjectMapper mapper = new ObjectMapper();
    private final Subscriber subscriber;

    public UserWebSocketHandler(final Subscriber subscriber) {
        this.subscriber = subscriber;
    }

    /**
     *
     */
    @Override
    public Mono<Void> handle(final WebSocketSession session) {

        final UnicastProcessor<User> publisher = subscriber.getPublisher();

        final Flux<String> outputEvents = publisher.replay(25).autoConnect().map(this::toJSON);

        session.receive()
                .map(WebSocketMessage::getPayloadAsText)
                // Transform the JSON to Objeto
                .map(this::toObject)
                .subscribe(subscriber.getPublisher()::onNext,
                        subscriber.getPublisher()::onError,
                        subscriber.getPublisher()::onComplete);
        return session.send(outputEvents.map(session::textMessage));
    }

    /**
     *
     * Convert a JSON to Object
     */
    private User toObject(final String json) {
        try {
            return mapper.readValue(json, User.class);
        } catch (IOException e) {
            throw new RuntimeException("Invalid JSON:" + json, e);
        }
    }


    /**
     *
     * Convert a Objeto to JSON
     */
    private String toJSON(final User user) {
        try {
            return mapper.writeValueAsString(user);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
