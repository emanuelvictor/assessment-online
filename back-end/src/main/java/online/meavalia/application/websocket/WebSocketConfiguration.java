package online.meavalia.application.websocket;

import online.meavalia.domain.entity.avaliacao.TipoAvaliacao;
import online.meavalia.domain.entity.unidade.Dispositivo;
import online.meavalia.domain.repository.DispositivoRepository;
import online.meavalia.infrastructure.converters.JsonConverter;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.reactive.HandlerMapping;
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping;
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class WebSocketConfiguration {

    private final ObjectMapper objectMapper;

    private final DispositivoRepository dispositivoRepository;

    @Bean
    public HandlerMapping webSocketMapping() {
        final Map<String, Object> map = new HashMap<>();
        map.put("/dispositivos/{id}/connect", new DispositivoWebSocketHandler(dispositivoRepository, new JsonConverter<>(Dispositivo.class, objectMapper), "/dispositivos/{id}/connect", "id", dispositivosWrapperHandler()));
        final SimpleUrlHandlerMapping simpleUrlHandlerMapping = new SimpleUrlHandlerMapping();
        simpleUrlHandlerMapping.setUrlMap(map);
        simpleUrlHandlerMapping.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return simpleUrlHandlerMapping;
    }

    @Bean
    public WebSocketHandlerAdapter handlerAdapter() {
        return new WebSocketHandlerAdapter();
    }

    @Bean
    public List<WrapperHandler<TipoAvaliacao>> tiposAvaliacoesWrapperHandler() {
        // Envelopa os subscribers
        return new ArrayList<>();
    }

    @Bean
    public List<WrapperHandler<Dispositivo>> dispositivosWrapperHandler() {
        // Envelopa os subscribers
        return new ArrayList<>();
    }
}
