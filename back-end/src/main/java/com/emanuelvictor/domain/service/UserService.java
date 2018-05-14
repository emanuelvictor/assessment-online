package com.emanuelvictor.domain.service;

import com.emanuelvictor.domain.entity.user.User;
import com.emanuelvictor.domain.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public UserService(final UserRepository userRepository, final PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     *
     * O parâmero pode ser um mono? TODO
     */
    public Mono<UserDetails> findByUsername(String username) {
        if (username.equals(User.MASTER_USERNAME)) {
            UserDetails userDetails = User.getMasterUser();
            return Mono.just(userDetails);
        }
        return Mono.just(userRepository.findByUsername(username));
    }

    /**
     *
     * O parâmero pode ser um mono? TODO
     */
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public Mono<User> insertUser(final Mono<User> user) {
        final User userToSave = user.block();
        userToSave.setPassword(this.passwordEncoder.encode(userToSave.getPassword()));
        return Mono.just(this.userRepository.save(userToSave));
    }

//    @PreAuthorize("hasRole('ADMINISTRATOR')")
//    public void removeUser(long userId) {
//        this.userRepository.deleteById(userId);
//    }

    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public Flux<User> findAll() {

        final List<User> list = this.userRepository.findAll();

        final User[] users = this.userRepository.findAll().toArray(new User[list.size()]);

        return Flux.just(users);
    }

}