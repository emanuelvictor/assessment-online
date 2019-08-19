package br.com.ubest.application.websocket.generic;

import reactor.core.publisher.UnicastProcessor;

import java.util.Optional;

public class WebSocketMessageSubscriber<T> {
    private UnicastProcessor<T> messagePublisher;
    private Optional<T> lastReceivedMessage = Optional.empty();

    public WebSocketMessageSubscriber(UnicastProcessor<T> messagePublisher) {
        this.messagePublisher = messagePublisher;
    }

    public void onNext(T object) {
        lastReceivedMessage = Optional.of(object);
        messagePublisher.onNext(object);
    }

    public void onError(Throwable error) {
        error.printStackTrace();
    }

    public void onComplete() {
        lastReceivedMessage.ifPresent(messagePublisher::onNext);
    }
}
