package br.com.ubest.application.websocket;

import br.com.ubest.domain.entity.unidade.Dispositivo;
import reactor.core.publisher.DirectProcessor;
import reactor.core.publisher.UnicastProcessor;
import reactor.core.publisher.MonoProcessor;
import reactor.core.publisher.UnicastProcessor;

import java.util.Optional;

public class WebSocketMessageSubscriber {
    private UnicastProcessor<Dispositivo> messagePublisher;
    private Optional<Dispositivo> lastReceivedMessage = Optional.empty();

    public WebSocketMessageSubscriber(UnicastProcessor<Dispositivo> messagePublisher) {
        this.messagePublisher = messagePublisher;
    }

    public void onNext(Dispositivo dispositivo) {
        lastReceivedMessage = Optional.of(dispositivo);
        messagePublisher.onNext(dispositivo);
    }

    public void onError(Throwable error) {
        error.printStackTrace();
    }

    public void onComplete() {
        lastReceivedMessage.ifPresent(messagePublisher::onNext);
    }
}
