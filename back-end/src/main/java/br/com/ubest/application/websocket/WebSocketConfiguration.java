package br.com.ubest.application.websocket;

import br.com.ubest.application.converters.JsonConverter;
import br.com.ubest.domain.entity.avaliacao.TipoAvaliacao;
import br.com.ubest.domain.entity.unidade.Dispositivo;
import br.com.ubest.domain.repository.DispositivoRepository;
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
        map.put("/dispositivos/{numeroLicenca}/connect", new DispositivoWebSocketHandler(dispositivoRepository, new JsonConverter<>(Dispositivo.class, objectMapper), "/dispositivos/{numeroLicenca}/connect", "numeroLicenca", dispositivosWrapperHandler()));
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
