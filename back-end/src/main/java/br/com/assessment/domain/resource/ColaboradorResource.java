package br.com.assessment.domain.resource;

import br.com.assessment.domain.entity.colaborador.Colaborador;
import br.com.assessment.domain.service.ColaboradorService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/colaboradores")
public class ColaboradorResource {

    private final ColaboradorService colaboradorService;

    @PostMapping
    public Mono<Colaborador> save(@RequestBody Mono<Colaborador> colaborador) {
        return this.colaboradorService.save(colaborador);
    }

    @PutMapping
    public Mono<Colaborador> update(@RequestBody Mono<Colaborador> colaborador) {
        return this.colaboradorService.save(colaborador);
    }

    @DeleteMapping
    public void delete(@RequestParam long colaboradorId) {
        this.colaboradorService.delete(colaboradorId);
    }

    @GetMapping("{id}")
    public Mono<Optional<Colaborador>> findColaboradorById(@PathVariable final long id) {
        return this.colaboradorService.findById(id);
    }

    @GetMapping
    public Flux<Colaborador> findAll() {
        return this.colaboradorService.findAll();
    }
}