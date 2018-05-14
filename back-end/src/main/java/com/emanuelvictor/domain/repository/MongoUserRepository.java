package com.emanuelvictor.domain.repository;

import com.emanuelvictor.domain.entity.user.User;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.security.core.userdetails.UserDetails;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface MongoUserRepository
        extends ReactiveMongoRepository<User, String>
{

    /**
     * @return
     */
    Flux<User> findByName(Mono<String> name);


    /**
     * @return
     */
    Mono<UserDetails> findByUsername(Mono<String> name);

}
