package online.meavalia.domain.domain.service;

import online.meavalia.application.tenant.TenantIdentifierResolver;
import online.meavalia.domain.AbstractIntegrationTests;
import online.meavalia.domain.FaturaService;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.jdbc.Sql;

public class FaturaServiceIntegrationTests extends AbstractIntegrationTests {

    /**
     *
     */
    @Autowired
    private FaturaService faturaService;

    /**
     *
     */
    @Autowired
    private TenantIdentifierResolver tenantIdentifierResolver;

    /**
     *
     */
    @Test
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
            "/dataset/fatura-em-atraso.sql",
            "/dataset/item-em-atraso.sql"
    })
    public void hasEmAtrasoMustPass() {
        tenantIdentifierResolver.setUsername("rodrigo.pfontes@bubblemixtea.com.br");
        Assert.assertTrue(faturaService.hasEmAtraso());
    }

    /**
     *
     */
    @Test
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
            "/dataset/fatura.sql",
            "/dataset/item.sql"
    })
    public void notHasEmAtrasoMustPass() {
        Assert.assertFalse(faturaService.hasEmAtraso());
    }

    /**
     *
     */
    @Test
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
            "/dataset/fatura-em-atraso.sql",
            "/dataset/item-em-atraso.sql"
    })
    public void hasEmAtrasoByDispositivoIdMustPass() {
        Assert.assertTrue(faturaService.hasEmAtraso());
    }

    /**
     *
     */
    @Test
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
            "/dataset/fatura.sql",
            "/dataset/item.sql"
    })
    public void notHasEmAtrasoByDispositivoIdMustPass() {
        Assert.assertFalse(faturaService.hasEmAtraso());
    }

}
