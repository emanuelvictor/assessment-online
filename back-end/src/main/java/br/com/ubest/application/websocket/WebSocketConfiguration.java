package br.com.ubest.application.websocket;

import br.com.ubest.application.converters.JsonConverter;
import br.com.ubest.domain.entity.avaliacao.TipoAvaliacao;
import br.com.ubest.domain.entity.unidade.Licenca;
import br.com.ubest.domain.repository.LicencaRepository;
import br.com.ubest.domain.repository.TipoAvaliacaoRepository;
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

    private final LicencaRepository licencaRepository;

    @Bean
    public HandlerMapping webSocketMapping() {
        final Map<String, Object> map = new HashMap<>();
        map.put("/licencas/{numero}/connect", new LicencaWebSocketHandler(licencaRepository, new JsonConverter<>(Licenca.class, objectMapper), "/licencas/{numero}/connect", "numero", dispositivosWrapperHandler()));
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
    public List<WrapperHandler<Licenca>> dispositivosWrapperHandler() {
        // Envelopa os subscribers
        return new ArrayList<>();
    }
}
