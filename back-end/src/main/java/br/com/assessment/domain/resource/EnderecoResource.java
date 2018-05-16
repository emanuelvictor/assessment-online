package br.com.assessment.domain.resource;

import br.com.assessment.domain.entity.endereco.Cidade;
import br.com.assessment.domain.service.EnderecoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Optional;

/**
 * @author
 */
@RestController
@RequestMapping("/cidades")
public class EnderecoResource {

    private final EnderecoService enderecoService;

    public EnderecoResource(final EnderecoService enderecoService) {
        this.enderecoService = enderecoService;
    }

    @GetMapping
    public Mono<Optional<Cidade>> find(@RequestParam String cidade, @RequestParam String uf)  {
        return this.enderecoService.find(cidade, uf);
    }
}
