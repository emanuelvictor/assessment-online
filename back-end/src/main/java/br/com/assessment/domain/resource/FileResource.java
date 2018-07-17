package br.com.assessment.domain.resource;

import br.com.assessment.domain.entity.usuario.Usuario;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.Part;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.synchronoss.cloud.nio.multipart.Multipart;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/uploads")
public class FileResource {

    private static final Logger LOGGER = LoggerFactory.getLogger(FileResource.class);

    /**
     *
     * @param file
     * @return
     */
    @PostMapping(/*consumes = MediaType.MULTIPART_FORM_DATA_VALUE*/)
    Mono<byte[]> requestBodyFlux(@RequestPart("file") Mono<Part> file) {
        LOGGER.info("Storing a new file. Recieved by Controller");
//        this.storageService.store(file);
        return Mono.create(monoSink -> {

            file.subscribe(part -> {
                part.content().subscribe(dataBuffer -> {
                    monoSink.success( dataBuffer.asByteBuffer().array());
                });
            });

//            monoSink.success();
        });
//        byte[] a = file.map(part ->  part.content().map(dataBuffer -> dataBuffer.asByteBuffer().array())).map( b -> {
//         b
//        });
//
//        file.subscribe(multipart -> {
//            multipart.content().subscribe(dataBuffer -> dataBuffer.asByteBuffer().array());
//            System.out.println(multipart.name());
//        });
//
//        return partFluxDescription(file);
    }


//    private static String partMapDescription(MultiValueMap<String, Part> partsMap) {
//        return partsMap.keySet().stream().sorted()
//                .map(key -> partListDescription(partsMap.get(key)))
//                .collect(Collectors.joining(",", "Map[", "]"));
//    }

//    private static Mono<String> partFluxDescription(Flux<? extends Part> partsFlux) {
//        return partsFlux.log().collectList().map(FileResource::partListDescription);
//    }
//
//    private static String partListDescription(List<? extends Part> parts) {
//        return parts.stream().map(FileResource::partDescription);
//    }
//
////    private static Part partDescription(Part part) {
////        return part;
////    }
//
//    private static String partDescription(Part part) {
//        return part instanceof FilePart ? part.name() + ":" + ((FilePart) part).filename() : part.name();
//    }
}
