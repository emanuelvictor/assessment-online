package online.meavalia.domain.service.domain.service;

import online.meavalia.domain.entity.avaliacao.UnidadeTipoAvaliacao;
import online.meavalia.domain.entity.unidade.Dispositivo;
import online.meavalia.domain.entity.unidade.UnidadeTipoAvaliacaoDispositivo;
import online.meavalia.domain.service.AbstractIntegrationTests;
import online.meavalia.domain.service.DispositivoService;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

public class DispositivoServiceIntegrationTests extends AbstractIntegrationTests {

    /**
     *
     */
    @Autowired
    private DispositivoService dispositivoService;

    /**
     *
     */
    @Test
    @Sql({"/dataset/truncate-all-tables.sql","/dataset/plano.sql", "/dataset/assinatura.sql", "/dataset/dispositivo.sql"})
    public void getDispositivoByIdMustPass() {
        final Dispositivo dispositivo = dispositivoService.getDispositivoByIdOrCodigo(3L);
        Assert.assertNotNull(dispositivo.getNome());
    }

    /**
     *
     */
    @Test(expected = java.lang.IllegalArgumentException.class)
    @Sql({"/dataset/truncate-all-tables.sql","/dataset/plano.sql", "/dataset/assinatura.sql", "/dataset/dispositivo.sql"})
    public void getDispositivoByIdMustFail() {
        dispositivoService.getDispositivoByIdOrCodigo(300444L);
    }

    /**
     *
     */
    @Test
    @Sql({"/dataset/truncate-all-tables.sql","/dataset/plano.sql", "/dataset/assinatura.sql", "/dataset/dispositivo.sql"})
    public void getDispositivoByCodigoMustPass() {
        final Dispositivo dispositivo = dispositivoService.getDispositivoByIdOrCodigo(105782L);
        Assert.assertNotNull(dispositivo.getNome());
    }

    /**
     *
     */
    @Test(expected = java.lang.IllegalArgumentException.class)
    @Sql({"/dataset/truncate-all-tables.sql","/dataset/plano.sql", "/dataset/assinatura.sql", "/dataset/dispositivo.sql"})
    public void updateStatusAtivoWithDispositivoDesativadoMustFail() {
        final Dispositivo dispositivo = dispositivoService.getDispositivoByIdOrCodigo(3L);
        Assert.assertFalse(dispositivo.isEnabled());
        dispositivoService.updateStatusAtivo(dispositivo.getId());
    }

    /**
     *
     */
    @Test
    @Sql({"/dataset/truncate-all-tables.sql", "/dataset/plano.sql", "/dataset/assinatura.sql", "/dataset/dispositivo.sql"})
    public void updateStatusAtivoWithDispositivoDesativadoMustPass() {
        final Dispositivo dispositivo = dispositivoService.getDispositivoByIdOrCodigo(4L);
        Assert.assertFalse(dispositivo.isEnabled());
        dispositivoService.updateStatusAtivo(4L);
        final Dispositivo dispositivoToAsserts = dispositivoService.getDispositivoByIdOrCodigo(4L);
        Assert.assertTrue(dispositivoToAsserts.isEnabled());
    }

    /**
     *
     */
    @Test
    @Sql({"/dataset/truncate-all-tables.sql","/dataset/plano.sql", "/dataset/assinatura.sql", "/dataset/dispositivo.sql"})
    public void reativarDispositivoMustPass() {
        this.updateStatusAtivoWithDispositivoDesativadoMustPass();
    }

    /**
     *
     */
    @Test(expected = java.lang.IllegalArgumentException.class)
    @Sql({"/dataset/truncate-all-tables.sql", "/dataset/plano.sql", "/dataset/assinatura.sql", "/dataset/dispositivo.sql"})
    public void updateDispositivoDesativadoMustFail() {
        final Dispositivo dispositivo = dispositivoService.getDispositivoByIdOrCodigo(3L);
        Assert.assertFalse(dispositivo.isEnabled());
        dispositivoService.updateDispositivo(dispositivo.getId(), dispositivo);
    }

    /**
     *
     */
    @Test(expected = java.lang.IllegalArgumentException.class)
    @Sql({
            "/dataset/truncate-all-tables.sql",
            "/dataset/cidade.sql",
            "/dataset/plano.sql",
            "/dataset/assinatura.sql",
            "/dataset/dispositivo.sql",
            "/dataset/tipo_avaliacao.sql",
            "/dataset/pessoa.sql",
            "/dataset/endereco.sql",
            "/dataset/unidade.sql",
            "/dataset/unidade_tipo_avaliacao.sql",
            "/dataset/unidade_tipo_avaliacao_dispositivo.sql"
    })
    public void saveUnidadesTiposAvaliacoesDispositivoMustFail() {

        final Dispositivo dispositivo = dispositivoService.getDispositivoByIdOrCodigo(3L);
        Assert.assertFalse(dispositivo.isEnabled());

        // Carrega as unidades tipos avaliações
        dispositivoService.loadDispositivo(dispositivo, null);

        Assert.assertNotNull(dispositivo.getUnidadesTiposAvaliacoesDispositivo());
        Assert.assertFalse(dispositivo.getUnidadesTiposAvaliacoesDispositivo().isEmpty());

        dispositivoService.saveUnidadesTiposAvaliacoesDispositivo(dispositivo.getId(), dispositivo.getUnidadesTiposAvaliacoesDispositivo());

    }

    /**
     *
     */
    @Test
    @Sql({
            "/dataset/truncate-all-tables.sql",
            "/dataset/cidade.sql",
            "/dataset/plano.sql",
            "/dataset/assinatura.sql",
            "/dataset/dispositivo.sql",
            "/dataset/tipo_avaliacao.sql",
            "/dataset/pessoa.sql",
            "/dataset/endereco.sql",
            "/dataset/unidade.sql",
            "/dataset/unidade_tipo_avaliacao.sql",
            "/dataset/unidade_tipo_avaliacao_dispositivo.sql"
    })
    public void saveUnidadesTiposAvaliacoesDispositivoMustPass() {

        final Dispositivo dispositivo = dispositivoService.getDispositivoByIdOrCodigo(5L);
        Assert.assertTrue(dispositivo.isEnabled());

        // Carrega as unidades tipos avaliações
        dispositivoService.loadDispositivo(dispositivo, null);

        Assert.assertNotNull(dispositivo.getUnidadesTiposAvaliacoesDispositivo());
        Assert.assertFalse(dispositivo.getUnidadesTiposAvaliacoesDispositivo().isEmpty());

        // Armazena o tamanho antigo da lista de unidades tipos avaliações
        final int oldSize = dispositivo.getUnidadesTiposAvaliacoesDispositivo().size();

        final UnidadeTipoAvaliacaoDispositivo unidadeTipoAvaliacaoDispositivo = new UnidadeTipoAvaliacaoDispositivo();
        unidadeTipoAvaliacaoDispositivo.setDispositivo(dispositivo);
        unidadeTipoAvaliacaoDispositivo.setUnidadeTipoAvaliacao(new UnidadeTipoAvaliacao(9L));
        unidadeTipoAvaliacaoDispositivo.setOrdem((short) 2);

        dispositivo.getUnidadesTiposAvaliacoesDispositivo().add(unidadeTipoAvaliacaoDispositivo);

        dispositivoService.saveUnidadesTiposAvaliacoesDispositivo(dispositivo.getId(), dispositivo.getUnidadesTiposAvaliacoesDispositivo());

        // Recarrega o dispositivos com suas unidades tipos avaliações
        dispositivoService.loadDispositivo(dispositivo, null);

        Assert.assertNotNull(dispositivo.getUnidadesTiposAvaliacoesDispositivo());
        Assert.assertFalse(dispositivo.getUnidadesTiposAvaliacoesDispositivo().isEmpty());
        Assert.assertNotEquals(oldSize, dispositivo.getUnidadesTiposAvaliacoesDispositivo().size());
        Assert.assertEquals(oldSize + 1, dispositivo.getUnidadesTiposAvaliacoesDispositivo().size());

    }

}
