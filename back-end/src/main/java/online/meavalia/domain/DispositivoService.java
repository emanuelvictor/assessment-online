package online.meavalia.domain;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageConfig;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import lombok.RequiredArgsConstructor;
import online.meavalia.application.aspect.exceptions.OverdueException;
import online.meavalia.application.tenant.TenantIdentifierResolver;
import online.meavalia.application.websocket.WrapperHandler;
import online.meavalia.domain.entity.unidade.Dispositivo;
import online.meavalia.domain.entity.unidade.UnidadeTipoAvaliacaoDispositivo;
import online.meavalia.domain.entity.usuario.Conta;
import online.meavalia.domain.repository.ContaRepository;
import online.meavalia.domain.repository.DispositivoRepository;
import online.meavalia.domain.repository.UnidadeTipoAvaliacaoDispositivoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.web.server.ServerWebExchange;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DispositivoService {

    /**
     *
     */
    private final FaturaService faturaService;

    /**
     *
     */
    private final ContaRepository contaRepository;

    /**
     *
     */
    private final AvaliavelService avaliavelService;

    /**
     *
     */
    private final DispositivoRepository dispositivoRepository;

    /**
     *
     */
    private final TenantIdentifierResolver tenantIdentifierResolver;

    /**
     *
     */
    private final List<WrapperHandler<Dispositivo>> dispositivosWrapperHandler;

    /**
     *
     */
    private final ServerSecurityContextRepository serverSecurityContextRepository;

    /**
     *
     */
    private final UnidadeTipoAvaliacaoDispositivoRepository unidadeTipoAvaliacaoDispositivoRepository;

    /**
     * Cria o contexto de autenticação a partir do Dispositivo
     *
     * @param userDetails {Dispositivo}
     * @return SecurityContext
     */
    private static SecurityContext createSecurityContextByUserDetails(final UserDetails userDetails) {
        final Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, userDetails.getPassword(), userDetails.getAuthorities());
        return new SecurityContextImpl(authentication);
    }

    /**
     * @param defaultFilter String
     * @param pageable      pageable
     * @return Page<Unidade>
     */
    public Page<Dispositivo> listDispositivosByFilters(final String defaultFilter, final Pageable pageable) {

        final Conta conta = contaRepository.findByEmailIgnoreCase(tenantIdentifierResolver.getUsername());
//
        final Long usuarioId = conta.isRoot() ? null : conta.getUsuario().getId();

        return this.dispositivoRepository.listByFilters(usuarioId, conta.getPerfil().name(), defaultFilter, this.tenantIdentifierResolver.resolveCurrentTenantIdentifier(), pageable);

    }


    /**
     * Carrega todas as informações necessárias do dispositivo para o funcionamento das avaliações.
     * Alterna entre os tenant's.
     *
     * @param id
     * @return
     */
    public Dispositivo getDispositivoByIdOrCodigo(final long id) {
        // Pega o dispositivo da base
        Dispositivo dispositivo = this.dispositivoRepository.findById(id).orElse(null);

        if (dispositivo == null)
            dispositivo = this.dispositivoRepository.findByCodigo(id).orElse(null);

        Assert.notNull(dispositivo, "Não encontrado");

        // Seta o tenant atual do dispositivo
        this.tenantIdentifierResolver.setSchema(dispositivo.getTenant());
        dispositivo = this.loadDispositivo(dispositivo, true);

        return dispositivo;
    }

    /**
     *
     * @param id
     * @return
     */
    public Optional<Dispositivo> findById(final long id) {
        return this.dispositivoRepository.findById(id);
    }

    /**
     * Carrega todas as informações necessárias do dispositivo para o funcionamento das avaliações.
     *
     * @param dispositivo
     * @param ativo       Pegar os vínculos ativos
     * @return
     */
    @Transactional(readOnly = true)
    public Dispositivo loadDispositivo(final Dispositivo dispositivo, final Boolean ativo) {
        dispositivo.setUnidadesTiposAvaliacoesDispositivo(new HashSet<>(this.unidadeTipoAvaliacaoDispositivoRepository.listByFilters(null, dispositivo.getId(), null, ativo, ativo, null).getContent()));
        dispositivo.getUnidadesTiposAvaliacoesDispositivo().forEach(unidadeTipoAvaliacaoDispositivo ->
                unidadeTipoAvaliacaoDispositivo.setAvaliaveis(new HashSet<>(this.avaliavelService.listByFilters(null, null, null, true, unidadeTipoAvaliacaoDispositivo.getId(), null).getContent()))
        );
        return dispositivo;
    }

    /**
     * TODO TESTAR mustpass e fails
     *
     * @param numeroSerie
     * @param codigo
     * @param exchange
     * @return
     */
    public Dispositivo authenticate(final String numeroSerie, final long codigo, final ServerWebExchange exchange) {

        // Pega o dispositivo da base
        final Dispositivo dispositivo = this.getDispositivoByIdOrCodigo(codigo);

        // Valida se o código está válido
        Assert.notNull(dispositivo, "Código inválido!");

        // Valida se o usuário acertou o código
        Assert.isTrue(dispositivo.getCodigo() == (codigo), "Código inválido!");

        // Valida se o código não expirou
        if (!dispositivo.isAccountNonExpired()) {

            // Renova o código
            dispositivo.setUpdated(LocalDateTime.now());
            final Dispositivo dispositivoUpdated = this.updateDispositivo(dispositivo.getId(), dispositivo);

            // Avisa os websockets
            dispositivosWrapperHandler.stream().filter(t -> t.getResourceId().equals(dispositivoUpdated.getId())).findFirst().ifPresent(
                    t -> t.getMessagePublisher().onNext(dispositivoUpdated)
            );

            throw new RuntimeException("Código expirado!");
        }

        // Valida se o usuário acertou o código
        Assert.isTrue(dispositivo.isEnabled(), "Dispositivo desativado!");

        // Verifico se a licença está sendo utilizada por outro aplicativo
        if (dispositivo.getNumeroSerie() != null && !dispositivo.getNumeroSerie().equals(numeroSerie))
            throw new RuntimeException("Essa licença está sendo utilizada por outro dispositivo");

        //  seto o número de série aqui, e somente aqui, não n o carramento do dispositivo
        dispositivo.setNumeroSerie(numeroSerie);

        //  Salva no banco
        this.dispositivoRepository.save(this.loadDispositivo(dispositivo, null));

        // Cria o contexto de segurança
        final SecurityContext securityContext = createSecurityContextByUserDetails(dispositivo);

        // Insere o contexto no repositório de contexto e retorna o usuário inserido
        if (exchange != null)
            serverSecurityContextRepository.save(exchange, securityContext).subscribe();

        // Avisa os websockets
        dispositivosWrapperHandler.stream().filter(t -> t.getResourceId().equals(dispositivo.getId())).findFirst().ifPresent(
                t -> t.getMessagePublisher().onNext(dispositivo)
        );

        //
        return dispositivo;
    }

    /**
     * @param dispositivo
     * @return
     */
    @Transactional
    public Dispositivo insertDispositivo(final Dispositivo dispositivo) {

        // Não pode inserir se houverem faturas em atraso
        if (dispositivo.getId() == null && faturaService.hasEmAtraso())
            throw new OverdueException("Existem faturas em atraso!"); // TODO internacionalizar

            // Se tem id então vai para o método de atualização
        else if (dispositivo.getId() != null)
            return updateDispositivo(dispositivo.getId(), dispositivo);

        // Seta o tenant no dispositivo
        dispositivo.setTenant(tenantIdentifierResolver.resolveCurrentTenantIdentifier());

        return this.dispositivoRepository.save(dispositivo);
    }

    /**
     * @param dispositivo
     * @return
     */
    @Transactional
    public Dispositivo updateDispositivo(final Long id, final Dispositivo dispositivo) {

        Assert.isTrue(this.dispositivoRepository.findById(id).orElseThrow().isEnabled(), "Este dispositivo está desativado"); // TODO Criar exception exlcusiva para faturas em atraso

        dispositivo.setId(id);

        // Seta o tenant no dispositivo
        dispositivo.setTenant(tenantIdentifierResolver.resolveCurrentTenantIdentifier());

        return this.dispositivoRepository.save(dispositivo);
    }

    /**
     * TODO tesar mustpass
     *
     * @param numeroSerie
     * @return
     */
    public Dispositivo updateDispositivoAndRemoveNumeroSerie(final String numeroSerie) {

        final Dispositivo dispositivo = this.dispositivoRepository.findByNumeroSerie(numeroSerie).orElse(null);

        if (dispositivo == null)
            return null;

        dispositivo.setNumeroSerie(null);

        this.dispositivoRepository.save(dispositivo);

        // Avisa os websockets
        dispositivosWrapperHandler.stream().filter(t -> t.getResourceId().equals(dispositivo.getId())).findFirst().ifPresent(
                t -> t.getMessagePublisher().onNext(dispositivo)
        );

        return dispositivo;
    }

    /**
     * @param id
     * @return
     */
    public Dispositivo updateStatusAtivo(final long id) {

        final Dispositivo dispositivo = this.dispositivoRepository.findById(id).orElseThrow();

        if (dispositivo.getDataDesativacao() != null)
            Assert.isTrue(dispositivo.getDataDesativacao().isBefore(LocalDate.now().minusMonths(6)), "Você só pode reativar o dispositivo a partir do dia " + dispositivo.getDataReativacao().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));

        // Se está desativando, seta a data de desativação
        if (dispositivo.isEnabled())
            dispositivo.setDataDesativacao(LocalDate.now());
        else
            dispositivo.setDataDesativacao(null);

        this.dispositivoRepository.save(dispositivo);

        // Avisa os websockets
        dispositivosWrapperHandler.stream().filter(t -> t.getResourceId().equals(dispositivo.getId())).findFirst().ifPresent(
                t -> t.getMessagePublisher().onNext(dispositivo)
        );

        return dispositivo;
    }

    /**
     * todo TESTAR musta pass e fail
     *
     * @param id
     * @return
     */
    public Dispositivo refreshCodigo(final long id) {

        final Dispositivo dispositivo = this.dispositivoRepository.findById(id).orElseThrow();

        Assert.isTrue(dispositivo.isEnabled(), "Este dispositivo está desativado"); // TODO Criar exception exlcusiva para faturas em atraso

        dispositivo.setCodigo(Dispositivo.getRandomNumberInRange());
        this.dispositivoRepository.save(dispositivo);

        // Avisa os websockets
        dispositivosWrapperHandler.stream().filter(t -> t.getResourceId().equals(dispositivo.getId())).findFirst().ifPresent(
                t -> t.getMessagePublisher().onNext(dispositivo)
        );

        return dispositivo;
    }

    /**
     * @param text
     * @param width
     * @param height
     * @return
     * @throws WriterException
     * @throws IOException
     */
    private byte[] generateQRCode(final String text, final int width, final int height) throws WriterException, IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        BitMatrix matrix = new MultiFormatWriter().encode(text, BarcodeFormat.QR_CODE, width, height);
        MatrixToImageWriter.writeToStream(matrix, MediaType.IMAGE_PNG.getSubtype(), baos, new MatrixToImageConfig());
        return baos.toByteArray();
    }

    /**
     * @param text
     * @param width
     * @param height
     * @return
     * @throws Exception
     */
    @Async
    public ListenableFuture<byte[]> generateQRCodeAsync(final String text, final int width, final int height) {
        try {
            return new AsyncResult<>(generateQRCode(text, width, height));
        } catch (WriterException | IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * @param id
     * @param unidadesTiposAvaliacoesDispositivo
     * @return
     */
    @Transactional
    public List<UnidadeTipoAvaliacaoDispositivo> saveUnidadesTiposAvaliacoesDispositivo(final long id, final Set<UnidadeTipoAvaliacaoDispositivo> unidadesTiposAvaliacoesDispositivo) {

        Assert.isTrue(this.dispositivoRepository.findById(id).orElseThrow().isEnabled(), "Este dispositivo está desativado"); // TODO Criar exception exlcusiva para faturas em atraso

        Objects.requireNonNull(unidadesTiposAvaliacoesDispositivo).forEach(unidadeTipoAvaliacaoDispositivo -> unidadeTipoAvaliacaoDispositivo.setDispositivo(new Dispositivo(id)));
        return this.unidadeTipoAvaliacaoDispositivoRepository.saveAll(unidadesTiposAvaliacoesDispositivo);
    }
}
