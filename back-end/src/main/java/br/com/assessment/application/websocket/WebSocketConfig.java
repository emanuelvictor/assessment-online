package br.com.assessment.application.websocket;


import br.com.assessment.domain.entity.usuario.Usuario;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.HandlerMapping;
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.UnicastProcessor;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class WebSocketConfig {

    private final Subscriber subscriber;

    /**
     * Import the websocketHandler
     */
    public WebSocketConfig(final Subscriber subscriber) {
        this.subscriber = subscriber;
    }

    @Bean
    public HandlerMapping webSocketMapping() {
        final Map<String, Object> map = new HashMap<>();
        map.put("/ws/users", this.webSocketHandler());
        final SimpleUrlHandlerMapping simpleUrlHandlerMapping = new SimpleUrlHandlerMapping();
        simpleUrlHandlerMapping.setUrlMap(map);

        //Without the order things break :-/
        simpleUrlHandlerMapping.setOrder(10);
        return simpleUrlHandlerMapping;
    }

    /**
     * Configura bean da adpater do websocket
     */
    @Bean
    public WebSocketHandlerAdapter handlerAdapter() {
        return new WebSocketHandlerAdapter();
    }


    /**
     * Websocket handler
     */

    @Bean
    WebSocketHandler webSocketHandler() {
        return new WebSocketHandler() {

            private final ObjectMapper mapper = new ObjectMapper();

            /**
             *
             */
            @Override
            public Mono<Void> handle(final WebSocketSession session) {

                final UnicastProcessor<Usuario> publisher = subscriber.getPublisher();

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
            private Usuario toObject(final String json) {
                try {
                    return mapper.readValue(json, Usuario.class);
                } catch (IOException e) {
                    throw new RuntimeException("Invalid JSON:" + json, e);
                }
            }


            /**
             *
             * Convert a Objeto to JSON
             */
            private String toJSON(final Usuario usuario) {
                try {
                    return mapper.writeValueAsString(usuario);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
            }
        };
    }
}