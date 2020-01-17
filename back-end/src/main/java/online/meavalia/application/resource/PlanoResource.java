package online.meavalia.application.resource;

import lombok.RequiredArgsConstructor;
import online.meavalia.domain.entity.assinatura.Plano;
import online.meavalia.domain.entity.usuario.Perfil;
import online.meavalia.domain.repository.PlanoRepository;
import online.meavalia.infrastructure.resource.AbstractResource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequiredArgsConstructor
@RequestMapping({"**planos", "**public/planos", "**sistema/planos", "**sistema/mobile/planos"})
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
