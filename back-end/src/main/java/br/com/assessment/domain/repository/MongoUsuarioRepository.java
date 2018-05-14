package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.usuario.Usuario;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.security.core.userdetails.UserDetails;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface MongoUsuarioRepository
        extends ReactiveMongoRepository<Usuario, String>
{

    /**
     * @return
     */
    Flux<Usuario> findByName(Mono<String> name);


    /**
     * @return
     */
    Mono<UserDetails> findByUsername(Mono<String> name);

}
