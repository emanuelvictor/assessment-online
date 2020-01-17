package online.meavalia.application.websocket;

import lombok.Getter;
import online.meavalia.infrastructure.converters.JsonConverter;
import reactor.core.publisher.Flux;
import reactor.core.publisher.UnicastProcessor;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

public class WrapperHandler<T> {

    private UnicastProcessor<T> messagePublisher;

    @Getter
    private Flux<String> outputMessages;

    // Contador de subscribers
    @Getter
    private int countSubscribers = 0;

    // Path para extração do ID
    @Getter
    private final Object resourceId;

    // Mapeador do JSON
    private JsonConverter<T> jsonConverter;

    // Recurso pego da base de dados
    private Optional<T> resource;

    /**
     *
     * @param resource Optional<T>
     * @param jsonConverter JsonConverter<T>
     * @param resourceId Object
     */
    WrapperHandler(final Optional<T> resource, final JsonConverter<T> jsonConverter, final Object resourceId) {
        this.resource = resource;
        this.resourceId = resourceId;
        this.jsonConverter = jsonConverter;
    }

    // Cria o fluxo vazio
    public UnicastProcessor<T> publisher() {
        final T object = resource.orElseThrow();
        return UnicastProcessor.create(new LinkedList<>(List.of(object)));
    }

    private Flux<T> flux(final UnicastProcessor<T> publisher) {
        return publisher.replay(1).autoConnect();
    }

    public UnicastProcessor<T> getMessagePublisher() {
        // Se as mensagens estão nulas, inicializa com o primeiro
        if (this.outputMessages == null) {
            this.messagePublisher = this.publisher();
            this.outputMessages = Flux.from(this.flux(this.messagePublisher))
                    // Criar flag pra saber se precisa mesmo pegar da base novamente
                    .map(entity -> jsonConverter.toJSON(resource.orElseThrow()));
        }
        countSubscribers++;
        return messagePublisher;
    }

    boolean nonSubscribers() {
        return countSubscribers == 0;
    }

    void decrementSubscribers() {
        if (countSubscribers > 0)
            countSubscribers--;
    }

}
