package br.com.assessment.domain.service;

import br.com.assessment.application.context.Context;
import br.com.assessment.domain.entity.configuracao.Configuracao;
import br.com.assessment.domain.entity.usuario.Conta;
import br.com.assessment.domain.repository.ConfiguracaoRepository;
import br.com.assessment.domain.repository.ContaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import static br.com.assessment.application.context.Context.DEFAULT_TENANT_ID;


@Service
@RequiredArgsConstructor
public class ConfiguracaoService {

    private final ContaRepository contaRepository;

    private final ConfiguracaoRepository configuracaoRepository;

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
        // Se o cliente é nulo ou igual ao public, retorna as configurações do public
        if (cliente == null || cliente.equals(DEFAULT_TENANT_ID))
            return this.getConfiguracao();

        // Se o cliente não é nulo e não é o public, então retorna as configurações do cliente
        Context.setCurrentSchema(cliente);
        final Configuracao configuracao = (this.configuracaoRepository.findAll().size() > 0) ? this.configuracaoRepository.findAll().get(0) : new Configuracao();
        Context.clearCurrentSchema();
        return configuracao;
    }

    public Configuracao getConfiguracao() {
        return (this.configuracaoRepository.findAll().size() > 0) ? this.configuracaoRepository.findAll().get(0) : new Configuracao();
    }

    public String saveBackground(final byte[] fileInBytes) {
        final Configuracao configuracao = this.getConfiguracao();

        configuracao.setBackgroundImage(fileInBytes);

        return this.configuracaoRepository.save(configuracao).getBackgroundImagePath();
    }

    public byte[] findBackground(final String cliente) {
        return getConfiguracao(cliente).getBackgroundImage();
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
        return this.getConfiguracao(cliente).getLogo();
    }

    public void deleteLogomarca() {
        final Configuracao configuracao = this.getConfiguracao();
        configuracao.setLogo(null);
        this.configuracaoRepository.save(configuracao);
    }

}