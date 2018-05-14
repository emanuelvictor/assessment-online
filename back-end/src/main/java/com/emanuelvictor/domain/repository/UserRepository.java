package com.emanuelvictor.domain.repository;

import com.emanuelvictor.domain.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserRepository
        extends JpaRepository<User, Long>
{

//    /**
//     * @return
//     */
//    Flux<User> findByName(Mono<String> name);
//
//
    /**
     * @return
     */
    UserDetails findByUsername(String username);

}
