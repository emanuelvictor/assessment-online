package br.com.ubest.application.resource;

import br.com.ubest.domain.entity.assinatura.Plano;
import br.com.ubest.domain.entity.usuario.Perfil;
import br.com.ubest.domain.repository.PlanoRepository;
import br.com.ubest.infrastructure.resource.AbstractResource;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequiredArgsConstructor
@RequestMapping({"**planos", "**sistema/planos", "**sistema/mobile/planos"})
public class PlanoResource extends AbstractResource<Plano> {

    /**
     *
     */
    private final PlanoRepository planoRepository;

    /**
     *
     * @return
     */
    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    Flux<Plano> findAll() {
        return Flux.fromStream(this.planoRepository.findAll().stream());
    }
}
