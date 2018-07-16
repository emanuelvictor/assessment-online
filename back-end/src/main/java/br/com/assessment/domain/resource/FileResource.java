package br.com.assessment.domain.resource;

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

    @PostMapping(value = "", consumes = MediaType.IMAGE_JPEG_VALUE)
    Mono<String> requestBodyFlux(@RequestPart("file") Mono<Part> file) {
        LOGGER.info("Storing a new file. Recieved by Controller");
//        this.storageService.store(file);

        file.subscribe(multipart -> {
            System.out.println(multipart.name());
        });

        return Mono.empty();
    }


//    private static String partMapDescription(MultiValueMap<String, Part> partsMap) {
//        return partsMap.keySet().stream().sorted()
//                .map(key -> partListDescription(partsMap.get(key)))
//                .collect(Collectors.joining(",", "Map[", "]"));
//    }

    private static Mono<String> partFluxDescription(Flux<? extends Part> partsFlux) {
        return partsFlux.log().collectList().map(FileResource::partListDescription);
    }

    private static String partListDescription(List<? extends Part> parts) {
        return parts.stream().map(FileResource::partDescription)
                .collect(Collectors.joining(",", "[", "]"));
    }

    private static String partDescription(Part part) {
        return part instanceof FilePart ? part.name() + ":" + ((FilePart) part).filename() : part.name();
    }
}
