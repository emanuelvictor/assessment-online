package br.com.assessment.application.websocket;

import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.repository.UsuarioRepository;
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

    private final UsuarioRepository usuarioRepository;

    public Subscriber(final UsuarioRepository usuarioRepository) {

        this.usuarioRepository = usuarioRepository;

    }

    private UnicastProcessor<Usuario> getUnicastProcessor(/*final Flux<Usuario> fluxUsuarios*/){

        final List<Usuario> list = this.usuarioRepository.findAll();

        final Usuario[] usuarios = this.usuarioRepository.findAll().toArray(new Usuario[list.size()]);

        final Flux<Usuario> fluxUsuarios = Flux.just(usuarios);

        final Stream<Usuario> stream = fluxUsuarios.toStream();

        final Queue<Usuario> queue = stream.collect(Collectors.toCollection(LinkedList::new));

        return UnicastProcessor.create(queue);
    }

    public UnicastProcessor<Usuario> getPublisher(){
        return this.getUnicastProcessor();
    }
}