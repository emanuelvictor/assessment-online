package com.emanuelvictor.domain.resource;

import com.emanuelvictor.domain.entity.user.User;
import com.emanuelvictor.domain.service.UserService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/users")
public class UserResource {

    private final UserService userService;

    //Note Spring Boot 4.3+ autowires single constructors now
    public UserResource(UserService userService) {
        this.userService = userService;
    }

    /**
     * TODO parâmetro deve ser um Mono
     * @param user
     * @return
     */
    @PostMapping
    public Mono<User> insertUsuario(@RequestBody Mono<User> user) {
        return this.userService.insertUser(user);
    }

    @GetMapping
    public Flux<User> findAll() {
        return this.userService.findAll();
    }
}