package br.com.ubest.application.websocket;

import reactor.core.publisher.UnicastProcessor;

import java.util.Optional;

public class WebSocketMessageSubscriber<T> {
    private UnicastProcessor<T> messagePublisher;
    private Optional<T> lastReceivedMessage = Optional.empty();

    WebSocketMessageSubscriber(final UnicastProcessor<T> messagePublisher) {
        this.messagePublisher = messagePublisher;
    }

    void onNext(final T object) {
        lastReceivedMessage = Optional.of(object);
        messagePublisher.onNext(object);
    }

    void onError(final Throwable error) {
        error.printStackTrace();
//        messagePublisher.onError(error);
    }

    public void onComplete() {
        messagePublisher.onComplete();
//        if (!messagePublisher.isEmpty())
//            lastReceivedMessage.ifPresent(messagePublisher::onNext);
    }
}
