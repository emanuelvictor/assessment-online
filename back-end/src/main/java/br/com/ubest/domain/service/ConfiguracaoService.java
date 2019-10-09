package br.com.ubest.domain.service;

import br.com.ubest.application.tenant.TenantIdentifierResolver;
import br.com.ubest.domain.entity.configuracao.Configuracao;
import br.com.ubest.domain.entity.usuario.Conta;
import br.com.ubest.domain.repository.ConfiguracaoRepository;
import br.com.ubest.domain.repository.ContaRepository;
import br.com.ubest.infrastructure.file.ImageUtils;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.io.IOException;

import static br.com.ubest.Application.DEFAULT_TENANT_ID;


@Service
@RequiredArgsConstructor
public class ConfiguracaoService {

    private final ContaRepository contaRepository;

    private final ConfiguracaoRepository configuracaoRepository;

    private final TenantIdentifierResolver tenantIdentifierResolver;

    public Configuracao save(final long id, final Configuracao configuracao) {
        Assert.isTrue(configuracao.getId().equals(id) && this.getConfiguracao().getId().equals(id), "Você não pode atualizar essas configurações");
        return this.configuracaoRepository.save(configuracao);
    }

    public Configuracao save(final Configuracao configuracao) {
        final Configuracao configuracaoDb = getConfiguracao();
        if (configuracaoDb != null) {
            configuracao.setBackgroundImage(configuracaoDb.getBackgroundImage());
            configuracao.setLogo(configuracaoDb.getLogo());
        }
        return this.configuracaoRepository.save(configuracao);
    }

    public StringBuffer getSchemaByUsername(final String username) {

        final Conta conta;

        if (username != null)
            conta = contaRepository.findByEmailIgnoreCase(username);
        else
            return new StringBuffer(DEFAULT_TENANT_ID);

        if (conta != null)
            return new StringBuffer(conta.getEsquema());
        else
            return new StringBuffer(DEFAULT_TENANT_ID);

    }

    public Configuracao getConfiguracao(final String cliente) {
        if (cliente == null || cliente.equals(DEFAULT_TENANT_ID))
            tenantIdentifierResolver.setSchema(DEFAULT_TENANT_ID);

        final String oldSchema = tenantIdentifierResolver.resolveCurrentTenantIdentifier();
        tenantIdentifierResolver.setSchema(DEFAULT_TENANT_ID);
        final Configuracao defaultConfiguration = (this.configuracaoRepository.findAll().size() > 0) ? this.configuracaoRepository.findAll().get(0) : new Configuracao();
        tenantIdentifierResolver.setSchema(oldSchema);

        // Se o cliente é nulo ou igual ao public, retorna as configurações do public
        if (cliente != null && cliente.equals("undefined"))
            return defaultConfiguration;

        // Se o cliente não é nulo e não é o public, então retorna as configurações do cliente
        tenantIdentifierResolver.setSchema(cliente);
        final Configuracao configuracao = (this.configuracaoRepository.findAll().size() > 0) ? this.configuracaoRepository.findAll().get(0) : new Configuracao();

        if (configuracao.getLogo() == null)
            configuracao.setLogo(defaultConfiguration.getLogo());

        if (configuracao.getBackgroundImage() == null)
            configuracao.setBackgroundImage(defaultConfiguration.getBackgroundImage());

        return configuracao;
    }

    public Configuracao getConfiguracao() {
        return (this.configuracaoRepository.findAll().size() > 0) ? this.configuracaoRepository.findAll().get(0) : new Configuracao();
    }

    /**
     * @param fileInBytes byte[]
     * @return String
     */
    public String saveBackground(final byte[] fileInBytes) {
        final Configuracao configuracao = this.getConfiguracao();

        try {
            final int width = ImageUtils.getBufferedImageFromByteArray(fileInBytes).getWidth();
            final int height = ImageUtils.getBufferedImageFromByteArray(fileInBytes).getHeight();

            final int imageWidth = width - (int) Math.round((width * 0.100));
            final int imageHeight = height - (int) Math.round((height * 0.100));

            configuracao.setBackgroundImage(ImageUtils.resizeImage(fileInBytes, imageWidth, imageHeight));
        } catch (IOException e) {
            e.printStackTrace();
        }

        return this.configuracaoRepository.save(configuracao).getBackgroundImagePath();
    }

    public byte[] findBackground(final String cliente) {

        final byte[] background = getConfiguracao(cliente).getBackgroundImage();

        if (background == null) {
            try {
                return IOUtils.toByteArray(getClass().getResource("../../../../../public/sistema/assets/images/banner.png"));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return background;
    }

    public void deleteBackground() {
        final Configuracao configuracao = this.getConfiguracao();
        configuracao.setBackgroundImage(null);
        this.configuracaoRepository.save(configuracao);
    }

    public String saveLogomarca(final byte[] fileInBytes) {
        final Configuracao configuracao = this.getConfiguracao();
        configuracao.setLogo(fileInBytes);
        return this.configuracaoRepository.save(configuracao).getLogoPath();
    }

    public byte[] findLogomarca(final String cliente) {

        final byte[] logomarca = getConfiguracao(cliente).getLogo();

        if (logomarca == null) {
            try {
                return IOUtils.toByteArray(getClass().getResource("../../../../../public/sistema/assets/images/ubest1.png"));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return logomarca;
    }

    public void deleteLogomarca() {
        final Configuracao configuracao = this.getConfiguracao();
        configuracao.setLogo(null);
        this.configuracaoRepository.save(configuracao);
    }

}
