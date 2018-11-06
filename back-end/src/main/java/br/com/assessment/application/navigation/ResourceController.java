package br.com.assessment.application.navigation;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import java.net.URI;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RouterFunctions.resources;

@Configuration
public class ResourceController {

    @Bean
    public RouterFunction<ServerResponse> routes() {
        return resources("/**", new ClassPathResource("public/"))
                .andRoute(GET("/sistema"),
                        request -> ServerResponse.ok().body(BodyInserters.fromResource(new ClassPathResource("public/index.html"))));
//                .andRoute(GET("/sistema/"),
//                        request -> ServerResponse.ok().body(BodyInserters.fromResource(new ClassPathResource("public/sistema/index.html"))))
//                .andRoute(GET("/sistema"),
//                        request -> ServerResponse.temporaryRedirect(URI.create("/sistema/")).build())
//                .andRoute(GET("/sistema/mobile/"),
//                        request -> ServerResponse.ok().body(BodyInserters.fromResource(new ClassPathResource("public/sistema/mobile/index.html"))))
//                .andRoute(GET("/sistema/mobile"),
//                        request -> ServerResponse.temporaryRedirect(URI.create("/sistema/mobile/")).build());
    }
}
