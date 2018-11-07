package br.com.assessment.application.navigation;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.reactive.result.view.Rendering;

import java.net.URI;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RouterFunctions.resources;

@Controller
//@PropertySource("classpath:messages.properties")

public class ResourceController {

    @RequestMapping("/")
    String index() {
        return "index";
    }

    @RequestMapping("/sistema")
    String sistema() {
        return "sistema/index";
    }

//    @GetMapping("/")
//    Rendering index() {
//        return Rendering.view("index").build();
//    }

    @Bean
    public RouterFunction<ServerResponse> routes() {
        return resources("/**", new ClassPathResource("public/"));
//                .andRoute(GET("/"),
//                        request -> ServerResponse.ok().body(BodyInserters.fromResource(new ClassPathResource("public/index.html"))))
//                .andRoute(GET("/sistema/**"),
//                        request -> ServerResponse.ok().body(BodyInserters.fromResource(new ClassPathResource("public/sistema/index.html"))))
//                .andRoute(GET("/sistema"),
//                        request -> ServerResponse.temporaryRedirect(URI.create("/sistema/")).build())
//                .andRoute(GET("/sistema/mobile/"),
//                        request -> ServerResponse.ok().body(BodyInserters.fromResource(new ClassPathResource("public/sistema/mobile/index.html"))))
//                .andRoute(GET("/sistema/mobile"),
//                        request -> ServerResponse.temporaryRedirect(URI.create("/sistema/mobile/")).build());
    }
//
//    @Bean
//    public RouterFunction<ServerResponse> outro() {
//        return resources("/sistema/**", new ClassPathResource("public/sistema/"))
//                .andRoute(GET("/sistema/"),
//                        request -> ServerResponse.ok().body(BodyInserters.fromResource(new ClassPathResource("public/sistema/index.html"))));
////                .andRoute(GET("/sistema/"),
////                        request -> ServerResponse.ok().body(BodyInserters.fromResource(new ClassPathResource("public/sistema/index.html"))))
////                .andRoute(GET("/sistema"),
////                        request -> ServerResponse.temporaryRedirect(URI.create("/sistema/")).build())
////                .andRoute(GET("/sistema/mobile/"),
////                        request -> ServerResponse.ok().body(BodyInserters.fromResource(new ClassPathResource("public/sistema/mobile/index.html"))))
////                .andRoute(GET("/sistema/mobile"),
////                        request -> ServerResponse.temporaryRedirect(URI.create("/sistema/mobile/")).build());
//    }
}
