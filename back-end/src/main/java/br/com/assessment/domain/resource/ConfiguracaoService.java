package br.com.assessment.domain.resource;

import br.com.assessment.application.multitenancy.TenantIdentifierResolver;
import br.com.assessment.domain.entity.configuracao.Configuracao;
import br.com.assessment.domain.repository.ConfiguracaoRepository;
import br.com.assessment.domain.repository.ContaRepository;
import br.com.assessment.infrastructure.file.ImageUtils;
import lombok.RequiredArgsConstructor;
import org.flywaydb.core.Flyway;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.Optional;


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
        return (this.configuracaoRepository.findAll().size() > 0) ? new Configuracao() : this.configuracaoRepository.findAll().get(0);
    }

    public String saveBackground(final long id, final byte[] fileInBytes) {
        final Configuracao configuracao = this.configuracaoRepository.findById(id).orElseGet(null);

        configuracao.setBackgroundImage(fileInBytes);

        return this.configuracaoRepository.save(configuracao).getBackgroundImagePath();
    }

    public byte[] findBackground(final long id) {
        return this.configuracaoRepository.findById(id).orElseGet(null).getBackgroundImage();
    }

    public void deleteBackground(long id) {
        final Configuracao configuracao = this.configuracaoRepository.findById(id).orElseGet(null);
        configuracao.setBackgroundImage(null);
        this.configuracaoRepository.save(configuracao);
    }

    public String saveLogomarca(final long id, final byte[] fileInBytes) {
        final Configuracao configuracao = this.configuracaoRepository.findById(id).orElseGet(null);

        configuracao.setLogo(fileInBytes);

        return this.configuracaoRepository.save(configuracao).getLogoPath();
    }

    public byte[] findLogomarca(final long id) {
        return this.configuracaoRepository.findById(id).orElseGet(null).getLogo();
    }

    public void deleteLogomarca(long id) {
        final Configuracao configuracao = this.configuracaoRepository.findById(id).orElseGet(null);
        configuracao.setLogo(null);
        this.configuracaoRepository.save(configuracao);
    }

}