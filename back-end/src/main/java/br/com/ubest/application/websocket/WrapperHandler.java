package br.com.ubest.application.websocket;

import br.com.ubest.application.converters.JsonConverter;
import lombok.Getter;
import org.springframework.data.jpa.repository.JpaRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.UnicastProcessor;

import java.util.LinkedList;
import java.util.List;

public class WrapperHandler<T> {

    private UnicastProcessor<T> messagePublisher;

    @Getter
    private Flux<String> outputMessages;

    // Contador de subscribers
    @Getter
    private int countSubscribers = 0;

    // Repositório
    private JpaRepository<T, Long> jpaRepository;

    // Path para extração do ID
    @Getter
    private final long resourceId;

    // Mapeador do JSON
    private JsonConverter<T> jsonConverter;

    /**
     * @param jpaRepository JpaRepository<T, Long>
     * @param resourceId    long
     */
    WrapperHandler(final JpaRepository<T, Long> jpaRepository, final JsonConverter<T> jsonConverter, final long resourceId) {
        this.jpaRepository = jpaRepository;
        this.resourceId = resourceId;
        this.jsonConverter = jsonConverter;
    }

    // Cria o fluxo vazio
    public UnicastProcessor<T> publisher(final long id) {
        final T object = this.jpaRepository.findById(id).orElseThrow();
        return UnicastProcessor.create(new LinkedList<>(List.of(object)));
    }

    private Flux<T> flux(final UnicastProcessor<T> publisher) {
        return publisher.replay(1).autoConnect();
    }

    UnicastProcessor<T> getMessagePublisher() {
        // Se as mensagens estão nulas, inicializa com o primeiro
        if (this.outputMessages == null) {
            this.messagePublisher = this.publisher(resourceId);
            this.outputMessages = Flux.from(this.flux(this.messagePublisher))
                    // Criar flag pra saber se precisa mesmo pegar da base novamente
                    .map(entity -> jsonConverter.toJSON(this.jpaRepository.findById(resourceId).orElseThrow()));
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
