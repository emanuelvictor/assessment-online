package br.com.assessment.domain.resource;

import br.com.assessment.application.context.LocalContext;
import br.com.assessment.domain.entity.avaliacao.Avaliacao;
import br.com.assessment.domain.entity.avaliacao.AvaliacaoAvaliavel;
import br.com.assessment.domain.entity.avaliacao.TipoAvaliacao;
import br.com.assessment.domain.entity.avaliacao.UnidadeTipoAvaliacao;
import br.com.assessment.domain.entity.unidade.Unidade;
import br.com.assessment.domain.entity.usuario.Perfil;
import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.entity.usuario.vinculo.Avaliavel;
import br.com.assessment.domain.entity.usuario.vinculo.Operador;
import br.com.assessment.domain.service.*;
import br.com.assessment.infrastructure.file.ImageUtils;
import lombok.RequiredArgsConstructor;
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
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.TimeZone;

@RestController
@RequiredArgsConstructor
@RequestMapping({"import", "sistema/import"})
public class ImportResource {

    private final UsuarioService usuarioService;

    private final UnidadeService unidadeService;

    private final EnderecoService enderecoService;

    private final OperadorService operadorService;

    private final AvaliavelService avaliavelService;

    private final AvaliacaoService avaliacaoService;

    private final TipoAvaliacaoService tipoAvaliacaoService;

    private final UnidadeTipoAvaliacaoService unidadeTipoAvaliacaoService;

    // Method which write the bytes into a file
    private static File getFile(byte[] bytes) {
        try {

            // Path of a file
            final String FILEPATH = LocalContext.getCurrentSchema() + ".json";
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
    @Transactional
    public String save(final byte[] fileInBytes) {

        try {
            final JSONParser parser = new JSONParser();
            final Object obj = parser.parse(new FileReader(Objects.requireNonNull(getFile(fileInBytes)).getAbsolutePath()));

//            final JSONObject usuariosJSONArray = (JSONObject) ((JSONObject) obj).get("usuarios");
//            usuariosJSONArray.forEach((key, usuarioJSON) -> {
//
//                try {
//
//                    final Usuario usuario = new Usuario();
//                    usuario.setNome((String) ((JSONObject) usuarioJSON).get("nome"));
//
//                    final Conta conta = new Conta();
//                    conta.setEmail((String) (((JSONObject) usuarioJSON).get("email")));
//                    conta.setAdministrador((((JSONObject) usuarioJSON).get("isAdministrador")) != null ? ((Boolean) (((JSONObject) usuarioJSON).get("isAdministrador"))) : false);
//                    conta.setPassword((((JSONObject) usuarioJSON).get("password")) != null ? ((String) (((JSONObject) usuarioJSON).get("password"))) : "123456");
//                    usuario.setConta(conta);
//
//                    usuarioService.save(usuario);
//
//                    if ((((JSONObject) usuarioJSON).get("urlFile")) != null) {
//                        final URL url = new URL((String) (((JSONObject) usuarioJSON).get("urlFile")));
//                        final URLConnection connection = url.openConnection();
//                        final InputStream in = connection.getInputStream();
//                        final byte[] bytes = IOUtils.toByteArray(in);
//                        in.close();
//
//                        usuarioService.save(usuario.getId(), bytes);
//                    }
//
//                } catch (IOException e) {
//                    e.printStackTrace();
//                }
//            });
//
//
//            final JSONObject unidadesJSONArray = (JSONObject) ((JSONObject) obj).get("unidades");
//            unidadesJSONArray.forEach((key, unidadeJSON) -> {
//
//                final Unidade unidade = new Unidade();
//                unidade.setNome((String) ((JSONObject) unidadeJSON).get("nome"));
//                unidade.setDocumento((String) ((JSONObject) unidadeJSON).get("cnpj"));
//
//
//                final Endereco endereco = new Endereco();
//                endereco.setCep((String) ((JSONObject) ((JSONObject) unidadeJSON).get("endereco")).get("cep"));
//                endereco.setNumero((String) ((JSONObject) ((JSONObject) unidadeJSON).get("endereco")).get("numero"));
//                endereco.setBairro((String) ((JSONObject) ((JSONObject) unidadeJSON).get("endereco")).get("bairro"));
//                endereco.setLogradouro((String) ((JSONObject) ((JSONObject) unidadeJSON).get("endereco")).get("logradouro"));
//                endereco.setComplemento((String) ((JSONObject) ((JSONObject) unidadeJSON).get("endereco")).get("complemento"));
//
//                final Cidade cidade = enderecoService.find((String) ((JSONObject) (((JSONObject) ((JSONObject) unidadeJSON).get("endereco")).get("cidade"))).get("nome"), (String) ((JSONObject) ((JSONObject) (((JSONObject) ((JSONObject) unidadeJSON).get("endereco")).get("cidade"))).get("estado")).get("sigla")).orElseGet(null);
//                endereco.setCidade(cidade);
//                unidade.setEndereco(endereco);
//
//                unidadeService.save(unidade);
//
//            });

            TipoAvaliacao tipoAvaliacaoFounded = tipoAvaliacaoService.listByFilters(null, null, null).getContent().get(0);
            if (tipoAvaliacaoFounded == null) {
                tipoAvaliacaoFounded = new TipoAvaliacao();
                tipoAvaliacaoFounded.setNome("Atendimento");
                tipoAvaliacaoFounded.setEnunciado("Como você avalia nosso atendimento?");
                tipoAvaliacaoFounded.setSelecao("Selecione os atendentes");
                tipoAvaliacaoService.save(tipoAvaliacaoFounded);
            }

            final TipoAvaliacao tipoAvaliacao = tipoAvaliacaoFounded;


            final JSONObject colaboradoresJSONArray = (JSONObject) ((JSONObject) obj).get("colaboradores");
            colaboradoresJSONArray.forEach((colaboradorKey, colaboradorJSON) -> {

                final JSONObject usuariosJSON = (JSONObject) ((JSONObject) obj).get("usuarios");
                final JSONObject unidadesJSON = (JSONObject) ((JSONObject) obj).get("unidades");

                final String usuarioNome = (String) ((JSONObject) usuariosJSON.get(((JSONObject) (((JSONObject) colaboradorJSON).get("usuario"))).get("key"))).get("nome");
                final String unidadeNome = (String) ((JSONObject) unidadesJSON.get(((JSONObject) (((JSONObject) colaboradorJSON).get("unidade"))).get("key"))).get("nome");

                final Usuario usuario = usuarioService.findByNome(usuarioNome).get(0);
                final Unidade unidade = unidadeService.findByNome(unidadeNome).get(0);

                UnidadeTipoAvaliacao unidadeTipoAvaliacao = new UnidadeTipoAvaliacao();
                unidadeTipoAvaliacao.setAtivo(true);
                unidadeTipoAvaliacao.setUnidade(unidade);
                unidadeTipoAvaliacao.setTipoAvaliacao(tipoAvaliacao);

                final UnidadeTipoAvaliacao founded = unidadeTipoAvaliacaoService.findByUnidadeIdAndTipoAvaliacaoId(unidade.getId(), tipoAvaliacao.getId());
                if (founded == null)
                    unidadeTipoAvaliacaoService.save(unidadeTipoAvaliacao);
                else unidadeTipoAvaliacao = founded;

                if (((JSONObject) colaboradorJSON).get("vinculo") != null && (((JSONObject) colaboradorJSON).get("vinculo").equals("Operador") || ((JSONObject) colaboradorJSON).get("vinculo").equals("OperadorAtendente"))) {
                    final Operador operador = new Operador();
                    operador.setUnidade(unidade);
                    operador.setUsuario(usuario);
                    operadorService.save(operador);
                }
                if (((JSONObject) colaboradorJSON).get("vinculo") != null && (((JSONObject) colaboradorJSON).get("vinculo").equals("Atendente") || ((JSONObject) colaboradorJSON).get("vinculo").equals("OperadorAtendente"))) {


                    final Avaliavel avaliavel = new Avaliavel();
                    avaliavel.setUsuario(usuario);
                    avaliavel.setUnidadeTipoAvaliacao(unidadeTipoAvaliacao);

                    avaliavelService.save(avaliavel);

                    final JSONObject avaliacoesColaboradoresJSONArray = (JSONObject) ((JSONObject) obj).get("avaliacoes-colaboradores");
                    avaliacoesColaboradoresJSONArray.forEach((avaliacaoColaboradorKey, avaliacaoColaboradorJSON) -> {
                        final String avaliacaoColaboradorColaboradorKey = (String) ((JSONObject) ((JSONObject) avaliacaoColaboradorJSON).get("colaborador")).get("key");

                        // Se o avaliavel é o avaliavel do loop externo (ou seja, o recém salvo)
                        if (avaliacaoColaboradorColaboradorKey.equals(colaboradorKey)) {

                            final AvaliacaoAvaliavel avaliacaoAvaliavel = new AvaliacaoAvaliavel();

                            // Seto o avaliavel recém salvo
                            avaliacaoAvaliavel.setAvaliavel(avaliavel);

                            /*
                             * ... Parto para o salvamento das avaliações
                             */

                            // Percorro as avaliações
                            final JSONObject avaliacoesJSONArray = (JSONObject) ((JSONObject) obj).get("avaliacoes");
                            avaliacoesJSONArray.forEach((avaliacaoKey, avaliacaoJSON) -> {

                                if (((JSONObject) avaliacaoJSON).get("nota") != null && ((JSONObject) avaliacaoJSON).get("data") != null) {

                                    // Se a avaliação do loop é igual a avialiação do avaliacaoAvaliavel, instancia e salva ela
                                    if (avaliacaoKey.equals(((JSONObject) ((JSONObject) avaliacaoColaboradorJSON).get("avaliacao")).get("key"))) {

                                        final Avaliacao avaliacao = new Avaliacao();

                                        // Verificação de variável de controle.
                                        // Se o jsonObject tiver a variável id, é pq a avaliação já foi salva,
                                        // então pega esse id e seta na avaliação que será vinculada á avaliacaoAvaliavel de fora
                                        if (((JSONObject) avaliacaoJSON).get("id") != null) {

                                            // Seta o id encontrado, que será o mesmo recém salvo no banco
                                            avaliacao.setId((Long) ((JSONObject) avaliacaoJSON).get("id"));


                                            // Se o jsonObject do avaliacaoAvaliavel não contiver a variável id,
                                            // Então instancia uma avaliação, seta a nota e a data e salva,
                                            // Depois pega o id e seta no jsonObject
                                        } else {

                                            // Extrai e seta a nota
                                            avaliacao.setNota(Integer.valueOf(Long.toString((Long) ((JSONObject) avaliacaoJSON).get("nota"))));

                                            // Extrai o timestamp da data da avaliação, em formato de long
                                            final long timestamp = (Long) ((JSONObject) avaliacaoJSON).get("data");

                                            // Converte o long para timestamp
                                            avaliacao.setData(LocalDateTime.ofInstant(Instant.ofEpochMilli(timestamp), TimeZone.getDefault().toZoneId()));

                                            // Salvo a avaliação
                                            this.avaliacaoService.save(avaliacao);

                                            // Seto o id no jsonObject da avaliação
                                            ((JSONObject) avaliacaoJSON).put("id", avaliacao.getId());

                                        }

                                        // Seto a avliação no avaliavel
                                        avaliacaoAvaliavel.setAvaliacao(avaliacao);

                                        // Salvo o avaliaçãoColaborador
                                        this.avaliacaoService.save(avaliacaoAvaliavel);

                                    }

                                }

                            });
                        }

                    });

                }

            });

            return "Migração Concluída";
        } catch (IOException | ParseException e) {
            e.printStackTrace();
            return null;
        }
    }

}