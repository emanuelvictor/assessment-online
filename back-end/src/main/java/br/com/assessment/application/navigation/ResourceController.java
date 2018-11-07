package br.com.assessment.application.navigation;

import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RouterFunctions.resources;

@Controller
//@PropertySource("classpath:messages.properties")

public class ResourceController {

    @RequestMapping("/")
    String index() {
        return "index";
    }

    @RequestMapping("/sistema")
    String sistemaWithBar() {
        return "redirect:/sistema/";
    }

    @RequestMapping("/sistema/")
    String sistema() {
        return "sistema/index";
    }

    @RequestMapping("/sistema/mobile")
    String mobileWithBar() {
        return "redirect:/sistema/mobile/";
    }

    @RequestMapping("/sistema/mobile/")
    String mobile() {
        return "sistema/mobile/index";
    }

    @Bean
    public RouterFunction<ServerResponse> routes() {
        return resources("/**", new ClassPathResource("public/"));
    }
}
