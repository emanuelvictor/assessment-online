package br.com.ubest.application.websocket;

import br.com.ubest.application.converters.JsonConverter;
import br.com.ubest.application.websocket.generic.GenericWebSocketHandler;
import br.com.ubest.domain.entity.avaliacao.TipoAvaliacao;
import br.com.ubest.domain.entity.unidade.Dispositivo;
import br.com.ubest.domain.repository.DispositivoRepository;
import br.com.ubest.domain.repository.TipoAvaliacaoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    private final TipoAvaliacaoRepository tipoAvaliacaoRepository;

    private final ObjectMapper objectMapper;

    @Bean
    public HandlerMapping webSocketMapping() {
        final Map<String, Object> map = new HashMap<>();
        map.put("/dispositivos/{id}", new GenericWebSocketHandler<>(dispositivoRepository, new JsonConverter<>(Dispositivo.class, objectMapper)));
        map.put("/tipos-avaliacoes/{id}", new GenericWebSocketHandler<>(tipoAvaliacaoRepository, new JsonConverter<>(TipoAvaliacao.class, objectMapper)));
        final SimpleUrlHandlerMapping simpleUrlHandlerMapping = new SimpleUrlHandlerMapping();
        simpleUrlHandlerMapping.setUrlMap(map);
        simpleUrlHandlerMapping.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return simpleUrlHandlerMapping;
    }

    @Bean
    public WebSocketHandlerAdapter handlerAdapter() {
        return new WebSocketHandlerAdapter();
    }
}
