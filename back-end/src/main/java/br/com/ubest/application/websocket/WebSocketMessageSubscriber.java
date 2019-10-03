package br.com.ubest.application.websocket;

import reactor.core.publisher.UnicastProcessor;

import java.util.List;

public class WebSocketMessageSubscriber<T> {

    private UnicastProcessor<T> messagePublisher;

    WebSocketMessageSubscriber(final UnicastProcessor<T> messagePublisher) {
        this.messagePublisher = messagePublisher;
    }

    void onNext(final T object) {
        messagePublisher.onNext(object);
    }

    void onError(final Throwable error) {
        error.printStackTrace();
        messagePublisher.onError(error);
//        wrapperHandler.decrementSubscribers();
//        if (wrapperHandler.nonSubscribers())
//            wrappersHandler.removeIf(tWrapperHandler -> tWrapperHandler.getResourceId().equals(resourceId));
    }

    public void onComplete() {
        messagePublisher.onComplete();
//        wrapperHandler.decrementSubscribers();
//        if (wrapperHandler.nonSubscribers())
//            wrappersHandler.removeIf(tWrapperHandler -> tWrapperHandler.getResourceId().equals(resourceId));
    }
}


//package br.com.ubest.application.websocket;
//
//import reactor.core.publisher.UnicastProcessor;
//
//import java.util.List;
//
//public class WebSocketMessageSubscriber<T> {
//
//    private UnicastProcessor<T> messagePublisher;
//
//    WebSocketMessageSubscriber(final UnicastProcessor<T> messagePublisher) {
//        this.messagePublisher = messagePublisher;
//    }
//
//    void onNext(final T object) {
//        messagePublisher.onNext(object);
//    }
//
//    void onError(final Throwable error, final WrapperHandler<T> wrapperHandler, final List<WrapperHandler<T>> wrappersHandler, final Object resourceId) {
//        error.printStackTrace();
//        messagePublisher.onError(error);
////        wrapperHandler.decrementSubscribers();
////        if (wrapperHandler.nonSubscribers())
////            wrappersHandler.removeIf(tWrapperHandler -> tWrapperHandler.getResourceId().equals(resourceId));
//    }
//
//    public void onComplete(final WrapperHandler<T> wrapperHandler, final List<WrapperHandler<T>> wrappersHandler, final Object resourceId) {
//        messagePublisher.onComplete();
////        wrapperHandler.decrementSubscribers();
////        if (wrapperHandler.nonSubscribers())
////            wrappersHandler.removeIf(tWrapperHandler -> tWrapperHandler.getResourceId().equals(resourceId));
//    }
//}
