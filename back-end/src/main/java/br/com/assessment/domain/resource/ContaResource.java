package br.com.assessment.domain.resource;

import br.com.assessment.domain.service.ContaService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/contas")
@AllArgsConstructor
public class ContaResource {

    private final ContaService contaService;

    /**
     *
     * @param email {String}
     * @return Mono<UserDetails>
     */
    @GetMapping(params = "email")
    public Mono<UserDetails> findUsuarioByEmail(@RequestParam final String email) {
        return this.contaService.findUsuarioByEmail(email);
    }

}