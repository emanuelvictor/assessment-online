package br.com.assessment.application.routing;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;

@Configuration
public class RoutesConfiguration {

    @Bean
    public RouterFunction<ServerResponse> routes(){
        return RouterFunctions.route(
                GET("/"),
                request -> ServerResponse.ok().body(BodyInserters.fromResource(new ClassPathResource("public/index.html")))
        );
    }
}
