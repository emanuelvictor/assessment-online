package online.meavalia.application.navigation;

import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RouterFunctions.resources;

@Controller
public class NavigaionController {

    @RequestMapping("/")
    String index() {
//        return "redirect:/sistema/";
        return "index";
    }

    @RequestMapping("/tests")
    String testsWithBar() {
        return "redirect:/tests/";
    }

    @RequestMapping("/tests/")
    String tests() {
        return "tests/index";
    }

    @RequestMapping("/sistema")
    String sistemaWithBar() {
        return "redirect:/sistema/";
    }

    @RequestMapping("/sistema/")
    String sistema() {
        return "sistema/index";
    }

    @RequestMapping("/public")
    String publicWithBar() {
        return "redirect:/public/";
    }

    @RequestMapping("/public/")
    String publicc() {
        return "public/index";
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

    @Bean
    RouterFunction<?> favicon() {
        return resources("/favicon.**", new ClassPathResource("public/assets/favicon.ico"));
    }

//    @Bean
//    public RouterFunction<ServerResponse> ssl() {
//        return resources("/.well-known/acme-challenge/**", new ClassPathResource("ssl/"));
//    }
}
