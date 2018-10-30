package br.com.assessment.domain.resource;

import br.com.assessment.domain.entity.endereco.Cidade;
import br.com.assessment.domain.service.EnderecoService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Optional;

/**
 * @author Emanuel Victor
 */
@RestController
@AllArgsConstructor
@RequestMapping({"**cidades", "**sistema/cidades", "**sistema/mobile/cidades"})
public class EnderecoResource {

    private final EnderecoService enderecoService;

    @GetMapping
    public Mono<Optional<Cidade>> find(@RequestParam String cidade, @RequestParam String uf)  {
        return Mono.just(this.enderecoService.find(cidade, uf));
    }
}
