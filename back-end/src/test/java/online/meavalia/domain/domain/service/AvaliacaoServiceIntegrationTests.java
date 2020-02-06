package online.meavalia.domain.domain.service;

import online.meavalia.application.aspect.exceptions.AccessDeniedException;
import online.meavalia.domain.AbstractIntegrationTests;
import online.meavalia.domain.AvaliacaoService;
import online.meavalia.domain.AvaliavelService;
import online.meavalia.domain.DispositivoService;
import online.meavalia.domain.entity.avaliacao.Agrupador;
import online.meavalia.domain.entity.avaliacao.Avaliacao;
import online.meavalia.domain.entity.avaliacao.AvaliacaoAvaliavel;
import online.meavalia.domain.entity.unidade.Dispositivo;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.jdbc.Sql;

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
    private DispositivoService dispositivoService;

    /**
     *
     */
    @Test(expected = AccessDeniedException.class)
    @WithUserDetails("contato@bubblemixtea.com.br")
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
    @WithUserDetails("contato@bubblemixtea.com.br")
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

        final Avaliacao avaliacao = new Avaliacao();
        avaliacao.setNota(4);

        final Agrupador agrupador = new Agrupador();

        agrupador.setAvaliacoes(List.of(avaliacao));
        avaliacao.setAgrupador(agrupador);

        final AvaliacaoAvaliavel avaliacaoAvaliavel = new AvaliacaoAvaliavel();
        avaliacaoAvaliavel.setAvaliacao(avaliacao);
        avaliacaoAvaliavel.setAvaliavel(avaliavelService.findById(2L).orElseThrow());

        avaliacao.setAvaliacoesAvaliaveis(List.of(avaliacaoAvaliavel));

        this.avaliacaoService.save(agrupador).subscribe();

    }

}
