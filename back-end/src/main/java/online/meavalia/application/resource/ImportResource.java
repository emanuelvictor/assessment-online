//package online.meavalia.application.resource;
//
//import online.meavalia.domain.entity.usuario.Perfil;
//import online.meavalia.domain.service.ImportService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.MediaType;
//import org.springframework.http.codec.multipart.Part;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestPart;
//import org.springframework.web.bind.annotation.RestController;
//import reactor.core.publisher.Flux;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping({"import", "sistema/import"})
//public class ImportResource {
//
//    final ImportService importService;
//
//    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
//    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
//    public Flux<String> save(@RequestPart("file") Flux<Part> file) {
//
//        return importService.save(file);
//
//    }
//
//}
