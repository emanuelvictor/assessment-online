package br.com.ubest.application.websocket;

import br.com.ubest.application.converters.JsonConverter;
import br.com.ubest.domain.entity.unidade.Licenca;
import br.com.ubest.domain.repository.LicencaRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Mono;

import java.util.List;

public class LicencaWebSocketHandler extends GenericWebSocketHandler<Licenca> {

    LicencaWebSocketHandler(final JpaRepository<Licenca, Long> jpaRepository,
                            final JsonConverter<Licenca> jsonConverter,
                            final String path, final String numero,
                            final List<WrapperHandler<Licenca>> wrappersHandler) {
        super(jpaRepository, jsonConverter, path, numero, wrappersHandler);
    }

    @Override
    public Mono<Void> handle(final WebSocketSession session) {

        final var numero = (Long) this.extractParameterNameFromSession(session);

        final WrapperHandler<Licenca> wrapperHandler = this.getWrapperHandlerByRosourceId(numero);

        final WebSocketMessageSubscriber<Licenca> subscriber = new WebSocketMessageSubscriber<>(wrapperHandler.getMessagePublisher());

        session.receive()
                .map(WebSocketMessage::getPayloadAsText)
                // Recebendo salva
                .map(s -> {
                    final Licenca licenca = jsonConverter.toObject(s);
                    licenca.setNumero((Long) this.extractParameterNameFromSession(session));

                    final Licenca licencaDB = ((LicencaRepository) jpaRepository).findByNumero(numero).orElse(new Licenca());
                    licenca.setId(licencaDB.getId());

                    licenca.setUnidadesTiposAvaliacoesLicenca(licencaDB.getUnidadesTiposAvaliacoesLicenca());

                    return this.jpaRepository.save(licenca);
                })
                .subscribe(subscriber::onNext, subscriber::onError
//                        , () -> {
//                    wrapperHandler.decrementSubscribers();
//                    if (wrapperHandler.nonSubscribers())
//                        removeWrapperHandlerByRosourceId(numero);
//                }
                );

        // Envia o que está na base
        return session.send(wrapperHandler.getOutputMessages().map(s -> {
            return session.textMessage(this.jsonConverter.toJSON(((LicencaRepository) jpaRepository).findByNumero(numero).orElse(new Licenca())));
        }));
    }

    /**
     * @param resourceId long
     * @return WrapperHandler<Licenca>
     */
    private WrapperHandler<Licenca> getWrapperHandlerByRosourceId(final Object resourceId) {
        if (wrappersHandler.stream().noneMatch(wh -> wh.getResourceId().equals(resourceId)))
            wrappersHandler.add(new WrapperHandler<>(((LicencaRepository) this.jpaRepository).findByNumero((Long) resourceId), jsonConverter, resourceId));
        return wrappersHandler.stream().filter(wh -> wh.getResourceId().equals(resourceId)).findFirst().orElseThrow();
    }

}
