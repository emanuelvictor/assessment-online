package br.com.assessment.domain.resource;

import br.com.assessment.domain.entity.configuracao.Configuracao;
import br.com.assessment.domain.repository.ConfiguracaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;


@Service
@RequiredArgsConstructor
public class ConfiguracaoService {

    private final ConfiguracaoRepository configuracaoRepository;

    public Configuracao save(final long id, final Configuracao configuracao) {
        Assert.isTrue(configuracao.getId().equals(id) && this.getConfiguracao().getId().equals(id), "Você não pode atualizar essas configurações");
        return this.configuracaoRepository.save(configuracao);
    }

    public Configuracao save(final Configuracao configuracao) {
        return this.configuracaoRepository.save(configuracao);
    }

    public Configuracao getConfiguracao() {
        return (this.configuracaoRepository.findAll().size() > 0) ? this.configuracaoRepository.findAll().get(0) : new Configuracao();
    }

    public String saveBackground(final byte[] fileInBytes) {
        final Configuracao configuracao = this.getConfiguracao();

        configuracao.setBackgroundImage(fileInBytes);

        return this.configuracaoRepository.save(configuracao).getBackgroundImagePath();
    }

    public byte[] findBackground() {
        return getConfiguracao().getBackgroundImage();
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

    public byte[] findLogomarca() {
        return this.getConfiguracao().getLogo();
    }

    public void deleteLogomarca() {
        final Configuracao configuracao = this.getConfiguracao();
        configuracao.setLogo(null);
        this.configuracaoRepository.save(configuracao);
    }

}