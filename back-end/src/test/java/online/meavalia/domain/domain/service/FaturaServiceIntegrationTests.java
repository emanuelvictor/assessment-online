package online.meavalia.domain.domain.service;

import online.meavalia.domain.AbstractIntegrationTests;
import online.meavalia.domain.FaturaService;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

public class FaturaServiceIntegrationTests extends AbstractIntegrationTests {

    /**
     *
     */
    @Autowired
    private FaturaService faturaService;

    /**
     * TODO fazer tabela de itens
     */
    @Test
    @Sql({
            "/dataset/truncate-all-tables.sql",
            "/dataset/plano.sql",
            "/dataset/assinatura.sql",
            "/dataset/dispositivo.sql",
            "/dataset/fatura-em-atraso.sql"
    })
    public void hasEmAtrasoMustPass() {
        Assert.assertTrue(faturaService.hasEmAtraso());
    }

    /**
     * TODO fazer tabela de itens
     */
    @Test
    @Sql({
            "/dataset/truncate-all-tables.sql",
            "/dataset/plano.sql",
            "/dataset/assinatura.sql",
            "/dataset/dispositivo.sql",
            "/dataset/fatura.sql"
    })
    public void notHasEmAtrasoMustPass() {
        Assert.assertFalse(faturaService.hasEmAtraso());
    }

    /**
     * TODO fazer tabela de itens
     */
    @Test
    @Sql({
            "/dataset/truncate-all-tables.sql",
            "/dataset/plano.sql",
            "/dataset/assinatura.sql",
            "/dataset/dispositivo.sql",
            "/dataset/fatura-em-atraso.sql"
    })
    public void hasEmAtrasoByDispositivoIdMustPass() {
        Assert.assertTrue(faturaService.hasEmAtraso());
    }

    /**
     * TODO fazer tabela de itens
     */
    @Test
    @Sql({
            "/dataset/truncate-all-tables.sql",
            "/dataset/plano.sql",
            "/dataset/assinatura.sql",
            "/dataset/dispositivo.sql",
            "/dataset/fatura.sql"
    })
    public void notHasEmAtrasoByDispositivoIdMustPass() {
        Assert.assertFalse(faturaService.hasEmAtraso());
    }

}
