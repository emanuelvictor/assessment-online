package br.com.assessment.domain.resource;

import br.com.assessment.domain.entity.unidade.Unidade;
import br.com.assessment.domain.service.UnidadeService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/unidades")
public class UnidadeResource {

    private final UnidadeService unidadeService;

    @PostMapping
    public Mono<Unidade> save(@RequestBody final Unidade unidade) {
        return this.unidadeService.save(unidade);
    }

    @PutMapping("{id}")
    public Mono<Unidade> save(@PathVariable final long id, @RequestBody final Unidade unidade) {
        return this.unidadeService.save(id, unidade);
    }

    @DeleteMapping("{id}")
    public Mono<Boolean> delete(@PathVariable final long id) {
        return this.unidadeService.delete(id);
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