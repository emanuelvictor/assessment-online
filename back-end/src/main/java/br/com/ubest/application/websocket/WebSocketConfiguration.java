package br.com.ubest.application.websocket;

import br.com.ubest.domain.entity.unidade.Dispositivo;
import br.com.ubest.domain.repository.DispositivoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.reactive.HandlerMapping;
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping;
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter;
import reactor.core.publisher.*;

import java.util.*;

@Configuration
@RequiredArgsConstructor
public class WebSocketConfiguration {

    private final DispositivoRepository dispositivoRepository;

    @Bean
    public UnicastProcessor<Dispositivo> dispositivoPublisher() {
        final Dispositivo dispositivo = new Dispositivo();//dispositivoRepository.findById(Long.valueOf(id)).orElse(null);
        dispositivo.setCodigo("TESTE");
        final List<Dispositivo> dispositivos = new ArrayList<>();
        dispositivos.add(dispositivo);
        return UnicastProcessor.create(new LinkedList<>(dispositivos));
//        return UnicastProcessor.create();
    }

    @Bean
    public Flux<Dispositivo> dispositivo(final UnicastProcessor<Dispositivo> dispositivoPublisher) {
        return dispositivoPublisher.replay(1).autoConnect();
    }

    @Bean
    public HandlerMapping webSocketMapping(UnicastProcessor<Dispositivo> dispositivoPublisher, Flux<Dispositivo> dispositivo) {
        Map<String, Object> map = new HashMap<>();
        map.put("/dispositivos/{id}", new DispositivoWebSocketHandler(dispositivoPublisher, dispositivo, dispositivoRepository));
        SimpleUrlHandlerMapping simpleUrlHandlerMapping = new SimpleUrlHandlerMapping();
        simpleUrlHandlerMapping.setUrlMap(map);
//        simpleUrlHandlerMapping.setOrder(10);
        simpleUrlHandlerMapping.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return simpleUrlHandlerMapping;
    }

    @Bean
    public WebSocketHandlerAdapter handlerAdapter() {
        return new WebSocketHandlerAdapter();
    }
}
