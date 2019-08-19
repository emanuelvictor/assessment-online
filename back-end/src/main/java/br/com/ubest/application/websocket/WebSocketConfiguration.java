package br.com.ubest.application.websocket;

import br.com.ubest.domain.repository.DispositivoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.reactive.HandlerMapping;
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping;
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter;

import java.util.HashMap;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class WebSocketConfiguration {

    private final DispositivoRepository dispositivoRepository;

    @Bean
    public HandlerMapping webSocketMapping() {
        final Map<String, Object> map = new HashMap<>();
        map.put("/dispositivos/{id}", new DispositivoWebSocketHandler(dispositivoRepository));
        SimpleUrlHandlerMapping simpleUrlHandlerMapping = new SimpleUrlHandlerMapping();
        simpleUrlHandlerMapping.setUrlMap(map);
        simpleUrlHandlerMapping.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return simpleUrlHandlerMapping;
    }

    @Bean
    public WebSocketHandlerAdapter handlerAdapter() {
        return new WebSocketHandlerAdapter();
    }
}
