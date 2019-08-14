package br.com.ubest.application.websocket;

import br.com.ubest.application.converters.JsonConverter;
import br.com.ubest.domain.entity.unidade.Dispositivo;
import br.com.ubest.domain.repository.DispositivoRepository;
import org.springframework.web.reactive.result.method.annotation.AbstractMessageReaderArgumentResolver;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import org.springframework.web.util.UriTemplate;
import reactor.core.publisher.*;

import java.util.*;

//@Component
//@RequiredArgsConstructor
public class DispositivoWebSocketHandler implements WebSocketHandler {

    private UnicastProcessor<Dispositivo> messagePublisher;
    private Flux<String> outputMessages;
    private DispositivoRepository dispositivoRepository;

    public DispositivoWebSocketHandler(UnicastProcessor<Dispositivo> dispositivoPublisher, Flux<Dispositivo> dispositivo, DispositivoRepository dispositivoRepository) {
        this.messagePublisher = dispositivoPublisher;
        this.outputMessages = Flux.from(dispositivo).map(new JsonConverter<Dispositivo>()::toJSON);
        this.dispositivoRepository = dispositivoRepository;
    }

    @Override
    public Mono<Void> handle(final WebSocketSession session) {
;
        // This can go in a static final
        final UriTemplate template = new UriTemplate("/dispositivos/{id}");
        final Map<String, String> parameters = template.match(session.getHandshakeInfo().getUri().toASCIIString());
        final String id = parameters.get("id");

        final Dispositivo dispositivo = new Dispositivo();//dispositivoRepository.findById(Long.valueOf(id)).orElse(null);
//        if (dispositivo == null)
//            return session.close();
        dispositivo.setCodigo("TESTE");
//        final List<String> dispositivos = new ArrayList<>();
//        dispositivos.add(new JsonConverter<Dispositivo>().toJSON(dispositivo));
        final List<Dispositivo> dispositivos = new ArrayList<>();
        dispositivos.add(dispositivo);
        
        
//        outputMessages = Flux.fromStream(dispositivos.stream()).replay(25).autoConnect();;

//        this.messagePublisher = UnicastProcessor.create(new LinkedList<>(dispositivos));
        
        final WebSocketMessageSubscriber subscriber = new WebSocketMessageSubscriber(messagePublisher);
        session.receive()
                .map(WebSocketMessage::getPayloadAsText)
                .map(s -> new JsonConverter<Dispositivo>().toEvent(s, Dispositivo.class))
                .subscribe(subscriber::onNext, subscriber::onError, subscriber::onComplete);
        return session.send(outputMessages.map(session::textMessage));
    }
}
