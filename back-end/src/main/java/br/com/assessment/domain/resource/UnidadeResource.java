package br.com.assessment.domain.resource;

import br.com.assessment.domain.entity.unidade.Unidade;
import br.com.assessment.domain.service.UnidadeService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Optional;

@RestController
@RequestMapping("/unidades")
public class UnidadeResource {

    private final UnidadeService unidadeService;

    public UnidadeResource(final UnidadeService unidadeService) {
        this.unidadeService = unidadeService;
    }

    @PostMapping
    public Mono<Unidade> save(@RequestBody final Unidade unidade) {
        return this.unidadeService.save(unidade);
    }

    @PutMapping("{id}")
    public Mono<Unidade> save(@PathVariable final long id, @RequestBody final Unidade unidade) {
        return this.unidadeService.save(id, unidade);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable final long id) {
        this.unidadeService.delete(id);
    }

    @GetMapping("{id}")
    public Mono<Optional<Unidade>> findById(@PathVariable final long id) {
        return this.unidadeService.findById(id);
    }

    @GetMapping
    public Flux<Unidade> findAll() {
        return this.unidadeService.findAll();
    }
}