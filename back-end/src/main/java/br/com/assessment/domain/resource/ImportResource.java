package br.com.assessment.domain.resource;

import br.com.assessment.domain.entity.usuario.Perfil;
import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.infrastructure.file.ImageUtils;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.Part;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.io.*;
import java.util.HashMap;

@RestController
@RequiredArgsConstructor
@RequestMapping("import")
public class ImportResource {

    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public Flux<String> save(@RequestPart("file") Flux<Part> file) {

        return file
                .filter(part -> part instanceof FilePart) // only retain file parts
                .ofType(FilePart.class)
                .flatMap(ImageUtils::getBytes)
                .map(this::save);

    }

    /**
     * @param fileInBytes byte[]
     * @return String
     */
    public String save(final byte[] fileInBytes) {

        try {
            final JSONParser parser = new JSONParser();
            final Object obj = parser.parse(new FileReader(getFile(fileInBytes).getAbsolutePath()));
            final JSONObject jsonObject = (JSONObject) obj;


            HashMap<String, Usuario> map = (HashMap) jsonObject;
            Usuario usuario = (Usuario) map.get("-L9VE11HwWYx5CNzG4a");
            ((JSONObject) obj).forEach( (o, o2) -> {
                System.out.println(o);
                System.out.println(o2);
            });
            System.out.println("rolou");
            return "rolou";
        } catch (IOException | ParseException e) {
            e.printStackTrace();
            return null;
        }
    }


    // Method which write the bytes into a file
    static File getFile(byte[] bytes) {
        try {

            // Path of a file
            final String FILEPATH = "a";
            final File file = new File(FILEPATH);

            // Initialize a pointer
            // in file using OutputStream
            OutputStream os = new FileOutputStream(file);

            // Starts writing the bytes in it
            os.write(bytes);
            System.out.println("Successfully byte inserted");

            // Close the file
            os.close();

            return file;
        } catch (Exception e) {
            System.err.println("Exception: " + e);
            return null;
        }
    }

}