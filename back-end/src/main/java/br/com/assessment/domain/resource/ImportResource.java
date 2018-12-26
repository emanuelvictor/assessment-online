package br.com.assessment.domain.resource;

import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Transactional
@RestController
@RequiredArgsConstructor
@RequestMapping({"import", "sistema/import"})
public class ImportResource {

//    private final UsuarioService usuarioService;
//
//    private final UnidadeService unidadeService;
//
//    private final EnderecoService enderecoService;
//
//    private final AvaliacaoService avaliacaoService;
//
//    private final OperadorService operadorService;
//
//    // Method which write the bytes into a file
//    private static File getFile(byte[] bytes) {
//        try {
//
//            // Path of a file
//            final String FILEPATH = LocalContext.getCurrentSchema() + ".json";
//            final File file = new File(FILEPATH);
//
//            // Initialize a pointer
//            // in file using OutputStream
//            OutputStream os = new FileOutputStream(file);
//
//            // Starts writing the bytes in it
//            os.write(bytes);
//            System.out.println("Successfully byte inserted");
//
//            // Close the file
//            os.close();
//
//            return file;
//        } catch (Exception e) {
//            System.err.println("Exception: " + e);
//            return null;
//        }
//    }
//
//    @PreAuthorize("hasAnyAuthority('" + Perfil.ADMINISTRADOR_VALUE + "')")
//    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
//    public Flux<String> save(@RequestPart("file") Flux<Part> file) {
//
//        return file
//                .filter(part -> part instanceof FilePart) // only retain file parts
//                .ofType(FilePart.class)
//                .flatMap(ImageUtils::getBytes)
//                .map(this::save);
//
//    }
//
//    /**
//     * @param fileInBytes byte[]
//     * @return String
//     */
//    public String save(final byte[] fileInBytes) {
//
//        try {
//            final JSONParser parser = new JSONParser();
//            final Object obj = parser.parse(new FileReader(getFile(fileInBytes).getAbsolutePath()));
//
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
//
//            final JSONObject avaliavelesJSONArray = (JSONObject) ((JSONObject) obj).get("avaliaveles");
//            avaliavelesJSONArray.forEach((avaliavelKey, avaliavelJSON) -> {
//
//                final JSONObject usuariosJSON = (JSONObject) ((JSONObject) obj).get("usuarios");
//                final JSONObject unidadesJSON = (JSONObject) ((JSONObject) obj).get("unidades");
//
//                final String usuarioNome = (String) ((JSONObject) usuariosJSON.get(((JSONObject) (((JSONObject) avaliavelJSON).get("usuario"))).get("key"))).get("nome");
//                final String unidadeNome = (String) ((JSONObject) unidadesJSON.get(((JSONObject) (((JSONObject) avaliavelJSON).get("unidade"))).get("key"))).get("nome");
//
//                final Usuario usuario = usuarioService.findByNome(usuarioNome).get(0);
//                final Unidade unidade = unidadeService.findByNome(unidadeNome).get(0);
//
//                final Colaborador avaliavel = new Colaborador();
//                avaliavel.setUsuario(usuario);
//                avaliavel.setUnidade(unidade);
//
//                if (((JSONObject) avaliavelJSON).get("vinculo") == "Operador") {
//                    avaliavel.setVinculo(Vinculo.Operador);
//                } else if (((JSONObject) avaliavelJSON).get("vinculo") == "OperadorAtendente") {
//                    avaliavel.setVinculo(Vinculo.OperadorAtendente);
//                } else {
//                    avaliavel.setVinculo(Vinculo.Atendente);
//                }
//
//                operadorService.save(avaliavel);
//
//                final JSONObject avaliacoesColaboradoresJSONArray = (JSONObject) ((JSONObject) obj).get("avaliacoes-avaliaveles");
//                avaliacoesColaboradoresJSONArray.forEach((avaliacaoColaboradorKey, avaliacaoColaboradorJSON) -> {
//                    final String avaliacaoColaboradorColaboradorKey = (String) ((JSONObject) ((JSONObject) avaliacaoColaboradorJSON).get("avaliavel")).get("key");
//
//                    // Se o avaliavel é o avaliavel do loop externo (ou seja, o recém salvo)
//                    if (avaliacaoColaboradorColaboradorKey.equals(avaliavelKey)) {
//
//                        final AvaliacaoAvaliavel avaliacaoAvaliavel = new AvaliacaoAvaliavel();
//
//                        // Seto o avaliavel recém salvo
//                        avaliacaoAvaliavel.setAvaliavel(avaliavel);
//
//                        /**
//                         * ... Parto para o salvamento das avaliações
//                         */
//
//                        // Percorro as avaliações
//                        final JSONObject avaliacoesJSONArray = (JSONObject) ((JSONObject) obj).get("avaliacoes");
//                        avaliacoesJSONArray.forEach((avaliacaoKey, avaliacaoJSON) -> {
//
//                            if (((JSONObject) avaliacaoJSON).get("nota") != null && ((JSONObject) avaliacaoJSON).get("data") != null) {
//
//                                // Se a avaliação do loop é igual a avialiação do avaliacaoAvaliavel, instancia e salva ela
//                                if (avaliacaoKey.equals(((JSONObject) ((JSONObject) avaliacaoColaboradorJSON).get("avaliacao")).get("key"))) {
//
//                                    final Avaliacao avaliacao = new Avaliacao();
//
//                                    // Verificação de variável de controle.
//                                    // Se o jsonObject tiver a variável id, é pq a avaliação já foi salva,
//                                    // então pega esse id e seta na avaliação que será vinculada á avaliacaoAvaliavel de fora
//                                    if (((JSONObject) avaliacaoJSON).get("id") != null) {
//
//                                        // Seta o id encontrado, que será o mesmo recém salvo no banco
//                                        avaliacao.setId((Long) ((JSONObject) avaliacaoJSON).get("id"));
//
//
//                                        // Se o jsonObject do avaliacaoAvaliavel não contiver a variável id,
//                                        // Então instancia uma avaliação, seta a nota e a data e salva,
//                                        // Depois pega o id e seta no jsonObject
//                                    } else {
//
//                                        // Extrai e seta a nota
//                                        avaliacao.setNota(Integer.valueOf(Long.toString((Long) ((JSONObject) avaliacaoJSON).get("nota"))));
//
//                                        // Extrai o timestamp da data da avaliação, em formato de long
//                                        final long timestamp = (Long) ((JSONObject) avaliacaoJSON).get("data");
//
//                                        // Converte o long para timestamp
//                                        avaliacao.setData(LocalDateTime.ofInstant(Instant.ofEpochMilli(timestamp), TimeZone.getDefault().toZoneId()));
//
//                                        // Salvo a avaliação
//                                        this.avaliacaoService.save(avaliacao);
//
//                                        // Seto o id no jsonObject da avaliação
//                                        ((JSONObject) avaliacaoJSON).put("id", avaliacao.getId());
//
//                                    }
//
//                                    // Seto a avliação no avaliavel
//                                    avaliacaoAvaliavel.setAvaliacao(avaliacao);
//
//                                    // Salvo o avaliaçãoColaborador
//                                    this.avaliacaoService.save(avaliacaoAvaliavel);
//
//                                }
//
//                            }
//
//                        });
//                    }
//
//                });
//
//            });
//
//            return "Migração Concluída";
//        } catch (IOException | ParseException e) {
//            e.printStackTrace();
//            return null;
//        }
//    }

}