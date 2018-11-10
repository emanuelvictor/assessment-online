package br.com.assessment.domain.resource;

import br.com.assessment.domain.entity.usuario.Conta;
import br.com.assessment.domain.entity.usuario.Perfil;
import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.service.UsuarioService;
import br.com.assessment.infrastructure.file.ImageUtils;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.IOUtils;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.Part;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;

@Transactional
@RestController
@RequiredArgsConstructor
@RequestMapping("import")
public class ImportResource {

    private final UsuarioService usuarioService;


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

            final JSONObject usuariosJSONArray = (JSONObject) ((JSONObject) obj).get("usuarios");

            usuariosJSONArray.forEach((key, usuarioJSON) -> {

                try {

                    final Usuario usuario = new Usuario();
                    usuario.setNome((String) ((JSONObject) usuarioJSON).get("nome"));

                    final Conta conta = new Conta();
                    conta.setEmail((String) (((JSONObject) usuarioJSON).get("email")));
                    conta.setAdministrador((((JSONObject) usuarioJSON).get("isAdministrador")) != null ? ((Boolean) (((JSONObject) usuarioJSON).get("isAdministrador"))) : false);
                    conta.setPassword((((JSONObject) usuarioJSON).get("password")) != null ? ((String) (((JSONObject) usuarioJSON).get("password"))) : "123456");
                    usuario.setConta(conta);

                    usuarioService.save(usuario);

                    if ((((JSONObject) usuarioJSON).get("urlFile")) != null){
                        final URL url = new URL((String) (((JSONObject) usuarioJSON).get("urlFile")));
                        final URLConnection connection = url.openConnection();
                        final InputStream in = connection.getInputStream();
                        final byte[] bytes = IOUtils.toByteArray(in);
                        in.close();

                        usuarioService.save(usuario.getId(), bytes);
                    }

                } catch (IOException e) {
                    e.printStackTrace();
                }
            });

            return "rolou";
        } catch (IOException | ParseException e) {
            e.printStackTrace();
            ;
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