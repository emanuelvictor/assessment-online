package com.emanuelvictor.application.websocket;

import com.emanuelvictor.domain.entity.user.User;
import com.emanuelvictor.domain.repository.UserRepository;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.UnicastProcessor;

import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class Subscriber {

    private UnicastProcessor<User> unicastProcessor;

    private final UserRepository userRepository;

    public Subscriber(final UserRepository userRepository) {

        this.userRepository = userRepository;

    }

    private UnicastProcessor<User> getUnicastProcessor(/*final Flux<User> fluxUsuarios*/){

        final List<User> list = this.userRepository.findAll();

        final User[] users = this.userRepository.findAll().toArray(new User[list.size()]);

        final Flux<User> fluxUsuarios = Flux.just(users);

        final Stream<User> stream = fluxUsuarios.toStream();

        final Queue<User> queue = stream.collect(Collectors.toCollection(LinkedList::new));

        return UnicastProcessor.create(queue);
    }

    public UnicastProcessor<User> getPublisher(){
        return this.getUnicastProcessor();
    }
}