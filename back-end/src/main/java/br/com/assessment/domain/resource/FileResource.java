package br.com.assessment.domain.resource;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.Part;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/uploads")
public class FileResource {

    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    Mono<String> requestBodyFlux(@RequestBody Flux<Part> parts) {
        parts.subscribe(part -> System.out.print(part));
        return Mono.empty();//partFluxDescription(parts);
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
