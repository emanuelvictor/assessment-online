package br.com.assessment.domain.resource;

import br.com.assessment.application.context.Context;
import br.com.assessment.domain.entity.colaborador.Colaborador;
import br.com.assessment.domain.entity.colaborador.Vinculo;
import br.com.assessment.domain.entity.endereco.Cidade;
import br.com.assessment.domain.entity.endereco.Endereco;
import br.com.assessment.domain.entity.unidade.Unidade;
import br.com.assessment.domain.entity.usuario.Conta;
import br.com.assessment.domain.entity.usuario.Perfil;
import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.service.ColaboradorService;
import br.com.assessment.domain.service.EnderecoService;
import br.com.assessment.domain.service.UnidadeService;
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

import java.io.*;
import java.net.URL;
import java.net.URLConnection;

@Transactional
@RestController
@RequiredArgsConstructor
@RequestMapping("import")
public class ImportResource {

    private final UsuarioService usuarioService;

    private final UnidadeService unidadeService;

    private final EnderecoService enderecoService;

    private final ColaboradorService colaboradorService;

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

                    if ((((JSONObject) usuarioJSON).get("urlFile")) != null) {
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


            final JSONObject unidadesJSONArray = (JSONObject) ((JSONObject) obj).get("unidades");
            unidadesJSONArray.forEach((key, unidadeJSON) -> {

                final Unidade unidade = new Unidade();
                unidade.setNome((String) ((JSONObject) unidadeJSON).get("nome"));
                unidade.setDocumento((String) ((JSONObject) unidadeJSON).get("cnpj"));


                final Endereco endereco = new Endereco();
                endereco.setCep((String) ((JSONObject) ((JSONObject) unidadeJSON).get("endereco")).get("cep"));
                endereco.setNumero((String) ((JSONObject) ((JSONObject) unidadeJSON).get("endereco")).get("numero"));
                endereco.setBairro((String) ((JSONObject) ((JSONObject) unidadeJSON).get("endereco")).get("bairro"));
                endereco.setLogradouro((String) ((JSONObject) ((JSONObject) unidadeJSON).get("endereco")).get("logradouro"));
                endereco.setComplemento((String) ((JSONObject) ((JSONObject) unidadeJSON).get("endereco")).get("complemento"));

                final Cidade cidade = enderecoService.find((String) ((JSONObject) (((JSONObject) ((JSONObject) unidadeJSON).get("endereco")).get("cidade"))).get("nome"), (String) ((JSONObject) ((JSONObject) (((JSONObject) ((JSONObject) unidadeJSON).get("endereco")).get("cidade"))).get("estado")).get("sigla")).orElseGet(null);
                endereco.setCidade(cidade);
                unidade.setEndereco(endereco);

                unidadeService.save(unidade);

            });

            final JSONObject colaboradoresJSONArray = (JSONObject) ((JSONObject) obj).get("colaboradores");
            colaboradoresJSONArray.forEach((key, colaboradorJSON) -> {

                final JSONObject usuariosJSON = (JSONObject) ((JSONObject) obj).get("usuarios");
                final JSONObject unidadesJSON = (JSONObject) ((JSONObject) obj).get("unidades");

                final String usuarioNome = (String) ( (JSONObject) usuariosJSON.get(((JSONObject) (((JSONObject) colaboradorJSON).get("usuario"))).get("key"))).get("nome");
                final String unidadeNome = (String) ( (JSONObject) unidadesJSON.get(((JSONObject) (((JSONObject) colaboradorJSON).get("unidade"))).get("key"))).get("nome");

                final Usuario usuario = usuarioService.findByNome(usuarioNome).get(0);
                final Unidade unidade = unidadeService.findByNome(unidadeNome).get(0);

                final Colaborador colaborador = new Colaborador();
                colaborador.setUsuario(usuario);
                colaborador.setUnidade(unidade);

                if (((JSONObject) colaboradorJSON).get("vinculo") == "Operador"){
                    colaborador.setVinculo(Vinculo.Operador);
                } else if (((JSONObject) colaboradorJSON).get("vinculo") == "OperadorAtendente"){
                    colaborador.setVinculo(Vinculo.OperadorAtendente);
                } else {
                    colaborador.setVinculo(Vinculo.Atendente);
                }

                colaboradorService.save(colaborador);
            });

            return "Migração Concluída";
        } catch (IOException | ParseException e) {
            e.printStackTrace();
            return null;
        }
    }


    // Method which write the bytes into a file
    private static File getFile(byte[] bytes) {
        try {

            // Path of a file
            final String FILEPATH = Context.getCurrentSchema() + ".json";
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