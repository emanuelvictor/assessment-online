package online.meavalia.domain.domain.service;

import online.meavalia.application.aspect.exceptions.AccessDeniedException;
import online.meavalia.application.aspect.exceptions.OverdueException;
import online.meavalia.application.tenant.TenantIdentifierResolver;
import online.meavalia.domain.AbstractIntegrationTests;
import online.meavalia.domain.AvaliacaoService;
import online.meavalia.domain.AvaliavelService;
import online.meavalia.domain.entity.avaliacao.Agrupador;
import online.meavalia.domain.entity.avaliacao.Avaliacao;
import online.meavalia.domain.entity.avaliacao.AvaliacaoAvaliavel;
import online.meavalia.domain.entity.generic.AbstractEntity;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.jdbc.Sql;
import org.junit.Assert;

import java.util.List;

public class AvaliacaoServiceIntegrationTests extends AbstractIntegrationTests {

    /**
     *
     */
    @Autowired
    private AvaliavelService avaliavelService;

    /**
     *
     */
    @Autowired
    private AvaliacaoService avaliacaoService;

    /**
     *
     */
    @Autowired
    private TenantIdentifierResolver tenantIdentifierResolver;

    /**
     *
     */
    @Test(expected = AccessDeniedException.class)
    @WithUserDetails("rodrigo.pfontes@bubblemixtea.com.br")
    @Sql({
            "/dataset/truncate-all-tables.sql",
            "/dataset/cidade.sql",
            "/dataset/plano.sql",
            "/dataset/assinatura.sql",
            "/dataset/dispositivo.sql",
            "/dataset/tipo-avaliacao.sql",
            "/dataset/conta.sql",
            "/dataset/pessoa.sql",
            "/dataset/usuario.sql",
            "/dataset/endereco.sql",
            "/dataset/unidade.sql",
            "/dataset/operador.sql",
            "/dataset/unidade-tipo-avaliacao.sql",
            "/dataset/unidade-tipo-avaliacao-dispositivo.sql",
            "/dataset/avaliavel.sql",
            "/dataset/fatura.sql",
            "/dataset/item.sql",
            "/dataset/update-sequences.sql"
    })
    public void insertAvaliacaoWithDispositivoWithoutSerialNumberMustFail() {

        tenantIdentifierResolver.setUsername("rodrigo.pfontes@bubblemixtea.com.br");

        final Avaliacao avaliacao = new Avaliacao();
        avaliacao.setNota(4);

        final Agrupador agrupador = new Agrupador();

        agrupador.setAvaliacoes(List.of(avaliacao));
        avaliacao.setAgrupador(agrupador);

        final AvaliacaoAvaliavel avaliacaoAvaliavel = new AvaliacaoAvaliavel();
        avaliacaoAvaliavel.setAvaliacao(avaliacao);
        avaliacaoAvaliavel.setAvaliavel(avaliavelService.findById(1L).orElseThrow());

        avaliacao.setAvaliacoesAvaliaveis(List.of(avaliacaoAvaliavel));

        this.avaliacaoService.save(agrupador).subscribe();

    }

    /**
     *
     */
    @Test(expected = AccessDeniedException.class)
    @WithUserDetails("rodrigo.pfontes@bubblemixtea.com.br")
    @Sql({
            "/dataset/truncate-all-tables.sql",
            "/dataset/cidade.sql",
            "/dataset/plano.sql",
            "/dataset/assinatura.sql",
            "/dataset/dispositivo.sql",
            "/dataset/tipo-avaliacao.sql",
            "/dataset/conta.sql",
            "/dataset/pessoa.sql",
            "/dataset/usuario.sql",
            "/dataset/endereco.sql",
            "/dataset/unidade.sql",
            "/dataset/operador.sql",
            "/dataset/unidade-tipo-avaliacao.sql",
            "/dataset/unidade-tipo-avaliacao-dispositivo.sql",
            "/dataset/avaliavel.sql",
            "/dataset/fatura.sql",
            "/dataset/item.sql",
            "/dataset/update-sequences.sql"
    })
    public void insertAvaliacaoWithDispositivoDisabledMustFail() {

        tenantIdentifierResolver.setUsername("rodrigo.pfontes@bubblemixtea.com.br");

        final Avaliacao avaliacao = new Avaliacao();
        avaliacao.setNota(4);

        final Agrupador agrupador = new Agrupador();

        agrupador.setAvaliacoes(List.of(avaliacao));
        avaliacao.setAgrupador(agrupador);

        final AvaliacaoAvaliavel avaliacaoAvaliavel = new AvaliacaoAvaliavel();
        avaliacaoAvaliavel.setAvaliacao(avaliacao);
        avaliacaoAvaliavel.setAvaliavel(avaliavelService.findById(2L).orElseThrow());

        avaliacao.setAvaliacoesAvaliaveis(List.of(avaliacaoAvaliavel));
        org.junit.Assert.assertNotNull(avaliacao);
        this.avaliacaoService.save(agrupador).subscribe();

    }

    /**
     *
     */
    @Test(expected = OverdueException.class)
    @WithUserDetails("rodrigo.pfontes@bubblemixtea.com.br")
    @Sql({
            "/dataset/truncate-all-tables.sql",
            "/dataset/cidade.sql",
            "/dataset/plano.sql",
            "/dataset/assinatura.sql",
            "/dataset/dispositivo.sql",
            "/dataset/tipo-avaliacao.sql",
            "/dataset/conta.sql",
            "/dataset/pessoa.sql",
            "/dataset/usuario.sql",
            "/dataset/endereco.sql",
            "/dataset/unidade.sql",
            "/dataset/operador.sql",
            "/dataset/unidade-tipo-avaliacao.sql",
            "/dataset/unidade-tipo-avaliacao-dispositivo.sql",
            "/dataset/avaliavel.sql",
            "/dataset/fatura-em-atraso.sql",
            "/dataset/item-em-atraso.sql",
            "/dataset/update-sequences.sql"
    })
    public void insertAvaliacaoWithFaturasEmAtrasoMustFail() {

        tenantIdentifierResolver.setUsername("rodrigo.pfontes@bubblemixtea.com.br");

        final Avaliacao avaliacao = new Avaliacao();
        avaliacao.setNota(4);

        final Agrupador agrupador = new Agrupador();

        agrupador.setAvaliacoes(List.of(avaliacao));
        avaliacao.setAgrupador(agrupador);

        final AvaliacaoAvaliavel avaliacaoAvaliavel = new AvaliacaoAvaliavel();
        avaliacaoAvaliavel.setAvaliacao(avaliacao);
        avaliacaoAvaliavel.setAvaliavel(avaliavelService.findById(3L).orElseThrow());

        avaliacao.setAvaliacoesAvaliaveis(List.of(avaliacaoAvaliavel));

        this.avaliacaoService.save(agrupador).subscribe();

    }

    /**
     *
     */
    @Test
    @WithUserDetails("dhiego@bubblemixtea.com.br")
    @Sql({
            "/dataset/truncate-all-tables.sql",
            "/dataset/cidade.sql",
            "/dataset/plano.sql",
            "/dataset/assinatura.sql",
            "/dataset/dispositivo.sql",
            "/dataset/tipo-avaliacao.sql",
            "/dataset/conta.sql",
            "/dataset/pessoa.sql",
            "/dataset/usuario.sql",
            "/dataset/endereco.sql",
            "/dataset/unidade.sql",
            "/dataset/operador.sql",
            "/dataset/unidade-tipo-avaliacao.sql",
            "/dataset/unidade-tipo-avaliacao-dispositivo.sql",
            "/dataset/avaliavel.sql",
            "/dataset/fatura.sql",
            "/dataset/item.sql",
            "/dataset/update-sequences.sql"
    })
    public void insertAvaliacaoMustPass() {

        tenantIdentifierResolver.setUsername("dhiego@bubblemixtea.com.br");

        final Avaliacao avaliacao = new Avaliacao();
        avaliacao.setNota(4);

        final Agrupador agrupador = new Agrupador();

        agrupador.setAvaliacoes(List.of(avaliacao));
        avaliacao.setAgrupador(agrupador);

        final AvaliacaoAvaliavel avaliacaoAvaliavel = new AvaliacaoAvaliavel();
        avaliacaoAvaliavel.setAvaliacao(avaliacao);
        avaliacaoAvaliavel.setAvaliavel(avaliavelService.findById(4L).orElseThrow());

        avaliacao.setAvaliacoesAvaliaveis(List.of(avaliacaoAvaliavel));

        this.avaliacaoService.save(agrupador).subscribe(result -> {
            Assert.assertNotNull(result.getId());
            Assert.assertNotNull(result.getAvaliacoes());
            result.getAvaliacoes().forEach(Assert::assertNotNull);
            result.getAvaliacoes().stream().map(AbstractEntity::getId).forEach(Assert::assertNotNull);
        });

    }

}
