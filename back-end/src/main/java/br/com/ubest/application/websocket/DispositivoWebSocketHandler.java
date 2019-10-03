package br.com.ubest.application.websocket;

import br.com.ubest.application.converters.JsonConverter;
import br.com.ubest.domain.entity.unidade.Dispositivo;
import br.com.ubest.domain.repository.DispositivoRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Mono;

import java.util.List;

public class DispositivoWebSocketHandler extends GenericWebSocketHandler<Dispositivo> {

    DispositivoWebSocketHandler(final JpaRepository<Dispositivo, Long> jpaRepository,
                                final JsonConverter<Dispositivo> jsonConverter,
                                final String path, final String numero,
                                final List<WrapperHandler<Dispositivo>> wrappersHandler) {
        super(jpaRepository, jsonConverter, path, numero, wrappersHandler);
    }

    @Override
    public Mono<Void> handle(final WebSocketSession session) {

        final var numero = (Long) this.extractParameterNameFromSession(session);

        final WrapperHandler<Dispositivo> wrapperHandler = this.getWrapperHandlerByRosourceId(numero);

        final WebSocketMessageSubscriber<Dispositivo> subscriber = new WebSocketMessageSubscriber<>(wrapperHandler.getMessagePublisher());

        session.receive()
                .map(WebSocketMessage::getPayloadAsText)
                // Recebendo salva
                .map(s -> {
                    final Dispositivo dispositivo = jsonConverter.toObject(s);
                    dispositivo.setNumeroLicenca((Long) this.extractParameterNameFromSession(session));

                    final Dispositivo dispositivoDB = ((DispositivoRepository) jpaRepository).findByNumeroLicenca(numero).orElse(new Dispositivo());
                    dispositivo.setId(dispositivoDB.getId());

                    dispositivo.setUnidadesTiposAvaliacoesDispositivo(dispositivoDB.getUnidadesTiposAvaliacoesDispositivo());

                    return this.jpaRepository.save(dispositivo);
                })
                .subscribe(subscriber::onNext, subscriber::onError
//                        , () -> {
//                    wrapperHandler.decrementSubscribers();
//                    if (wrapperHandler.nonSubscribers())
//                        removeWrapperHandlerByRosourceId(numero);
//                }
                );

        // Envia o que está na base
        return session.send(wrapperHandler.getOutputMessages().map(s -> session.textMessage(this.jsonConverter.toJSON(((DispositivoRepository) jpaRepository).findByNumeroLicenca(numero).orElse(new Dispositivo())))));
    }

    /**
     * @param resourceId long
     * @return WrapperHandler<Dispositivo>
     */
    private WrapperHandler<Dispositivo> getWrapperHandlerByRosourceId(final Object resourceId) {
        if (wrappersHandler.stream().noneMatch(wh -> wh.getResourceId().equals(resourceId)))
            wrappersHandler.add(new WrapperHandler<>(((DispositivoRepository) this.jpaRepository).findByNumeroLicenca((Long) resourceId), jsonConverter, resourceId));
        return wrappersHandler.stream().filter(wh -> wh.getResourceId().equals(resourceId)).findFirst().orElseThrow();
    }

}




//package br.com.ubest.application.websocket;
//
//import br.com.ubest.application.converters.JsonConverter;
//import br.com.ubest.domain.entity.unidade.Dispositivo;
//import br.com.ubest.domain.repository.DispositivoRepository;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.web.reactive.socket.WebSocketMessage;
//import org.springframework.web.reactive.socket.WebSocketSession;
//import reactor.core.publisher.Mono;
//
//import java.util.List;
//
//public class DispositivoWebSocketHandler extends GenericWebSocketHandler<Dispositivo> {
//
//    DispositivoWebSocketHandler(final JpaRepository<Dispositivo, Long> jpaRepository,
//                                final JsonConverter<Dispositivo> jsonConverter,
//                                final String path, final String numero,
//                                final List<WrapperHandler<Dispositivo>> wrappersHandler) {
//        super(jpaRepository, jsonConverter, path, numero, wrappersHandler);
//    }
//
//    @Override
//    public Mono<Void> handle(final WebSocketSession session) {
//
//        final var numero = (Long) this.extractParameterNameFromSession(session);
//
//        final WrapperHandler<Dispositivo> wrapperHandler = this.getWrapperHandlerByRosourceId(numero);
//
//        final WebSocketMessageSubscriber<Dispositivo> subscriber = new WebSocketMessageSubscriber<>(wrapperHandler.getMessagePublisher());
//
//        session.receive()
//                .map(WebSocketMessage::getPayloadAsText)
//                // Recebendo salva
//                .map(s -> {
//                    final Dispositivo dispositivo = jsonConverter.toObject(s);
//                    dispositivo.setNumeroLicenca((Long) this.extractParameterNameFromSession(session));
//
//                    final Dispositivo dispositivoDB = ((DispositivoRepository) jpaRepository).findByNumeroLicenca(numero).orElse(new Dispositivo());
//                    dispositivo.setId(dispositivoDB.getId());
//
//                    dispositivo.setUnidadesTiposAvaliacoesDispositivo(dispositivoDB.getUnidadesTiposAvaliacoesDispositivo());
//
//                    return this.jpaRepository.save(dispositivo);
//                })
//                .subscribe(subscriber::onNext,
//                        throwable -> subscriber.onError(throwable, wrapperHandler, wrappersHandler, numero),
//                        () -> subscriber.onComplete(wrapperHandler, wrappersHandler, numero)
//                );
//
//        // Envia o que está na base
//        return session.send(wrapperHandler.getOutputMessages().map(s -> session.textMessage(this.jsonConverter.toJSON(((DispositivoRepository) jpaRepository).findByNumeroLicenca(numero).orElse(new Dispositivo())))));
//    }
//
//    /**
//     * @param resourceId long
//     * @return WrapperHandler<Dispositivo>
//     */
//    private WrapperHandler<Dispositivo> getWrapperHandlerByRosourceId(final Object resourceId) {
//        if (wrappersHandler.stream().noneMatch(wh -> wh.getResourceId().equals(resourceId)))
//            wrappersHandler.add(new WrapperHandler<>(((DispositivoRepository) this.jpaRepository).findByNumeroLicenca((Long) resourceId), jsonConverter, resourceId));
//        return wrappersHandler.stream().filter(wh -> wh.getResourceId().equals(resourceId)).findFirst().orElseThrow();
//    }
//
//}
