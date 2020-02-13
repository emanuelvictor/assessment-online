package online.meavalia.domain.domain.service;

import online.meavalia.application.tenant.TenantIdentifierResolver;
import online.meavalia.domain.AbstractIntegrationTests;
import online.meavalia.domain.service.DispositivoService;
import online.meavalia.domain.entity.avaliacao.UnidadeTipoAvaliacao;
import online.meavalia.domain.entity.unidade.Dispositivo;
import online.meavalia.domain.entity.unidade.UnidadeTipoAvaliacaoDispositivo;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;

public class DispositivoServiceIntegrationTests extends AbstractIntegrationTests {

    /**
     *
     */
    @Autowired
    private DispositivoService dispositivoService;

    /**
     *
     */
    @Autowired
    private TenantIdentifierResolver tenantIdentifierResolver;

    /**
     *
     */
    @Test
    @Sql({"/dataset/truncate-all-tables.sql", "/dataset/plano.sql", "/dataset/assinatura.sql", "/dataset/dispositivo.sql"})
    public void getDispositivoByIdMustPass() {
        final Dispositivo dispositivo = dispositivoService.getDispositivoByIdOrCodigo(3L);
        Assert.assertNotNull(dispositivo.getNome());
    }

    /**
     *
     */
    @Test(expected = java.lang.IllegalArgumentException.class)
    @Sql({"/dataset/truncate-all-tables.sql", "/dataset/plano.sql", "/dataset/assinatura.sql", "/dataset/dispositivo.sql"})
    public void getDispositivoByIdMustFail() {
        dispositivoService.getDispositivoByIdOrCodigo(300444L);
    }

    /**
     *
     */
    @Test
    @Sql({"/dataset/truncate-all-tables.sql", "/dataset/plano.sql", "/dataset/assinatura.sql", "/dataset/dispositivo.sql"})
    public void getDispositivoByCodigoMustPass() {
        final Dispositivo dispositivo = dispositivoService.getDispositivoByIdOrCodigo(105782L);
        Assert.assertNotNull(dispositivo.getNome());
    }

    /**
     *
     */
    @Test(expected = java.lang.IllegalArgumentException.class)
    @Sql({"/dataset/truncate-all-tables.sql", "/dataset/plano.sql", "/dataset/assinatura.sql", "/dataset/dispositivo.sql"})
    public void updateStatusAtivoWithDispositivoDesativadoMustFail() {
        final Dispositivo dispositivo = dispositivoService.getDispositivoByIdOrCodigo(2L);
        Assert.assertFalse(dispositivo.isEnabled());
        dispositivoService.updateStatusAtivo(dispositivo.getId());
    }

    /**
     *
     */
    @Test
    @Sql({"/dataset/truncate-all-tables.sql", "/dataset/plano.sql", "/dataset/assinatura.sql", "/dataset/dispositivo.sql"})
    public void updateStatusAtivoWithDispositivoDesativadoMustPass() {
        final Dispositivo dispositivo = dispositivoService.getDispositivoByIdOrCodigo(5L);
        Assert.assertFalse(dispositivo.isEnabled());
        dispositivoService.updateStatusAtivo(5L);
        final Dispositivo dispositivoToAsserts = dispositivoService.getDispositivoByIdOrCodigo(5L);
        Assert.assertTrue(dispositivoToAsserts.isEnabled());
    }

    /**
     *
     */
    @Test
    @Sql({"/dataset/truncate-all-tables.sql", "/dataset/plano.sql", "/dataset/assinatura.sql", "/dataset/dispositivo.sql"})
    public void reativarDispositivoMustPass() {
        this.updateStatusAtivoWithDispositivoDesativadoMustPass();
    }

    /**
     *
     */
    @Test(expected = java.lang.IllegalArgumentException.class)
    @Sql({"/dataset/truncate-all-tables.sql", "/dataset/plano.sql", "/dataset/assinatura.sql", "/dataset/dispositivo.sql"})
    public void updateDispositivoDesativadoMustFail() {
        final Dispositivo dispositivo = dispositivoService.getDispositivoByIdOrCodigo(2L);
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
            "/dataset/tipo-avaliacao.sql",
            "/dataset/pessoa.sql",
            "/dataset/endereco.sql",
            "/dataset/unidade.sql",
            "/dataset/unidade-tipo-avaliacao.sql",
            "/dataset/unidade-tipo-avaliacao-dispositivo.sql"
    })
    public void saveUnidadesTiposAvaliacoesDispositivoMustFail() {

        final Dispositivo dispositivo = dispositivoService.getDispositivoByIdOrCodigo(2L);
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
            "/dataset/tipo-avaliacao.sql",
            "/dataset/pessoa.sql",
            "/dataset/endereco.sql",
            "/dataset/unidade.sql",
            "/dataset/unidade-tipo-avaliacao.sql",
            "/dataset/unidade-tipo-avaliacao-dispositivo.sql"
    })
    public void saveUnidadesTiposAvaliacoesDispositivoMustPass() {

        final Dispositivo dispositivo = dispositivoService.getDispositivoByIdOrCodigo(1L);
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

    /**
     *
     */
    @WithUserDetails("rodrigo.pfontes@bubblemixtea.com.br")
    @Test(expected = java.lang.RuntimeException.class)
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
            "/dataset/item-em-atraso.sql",
            "/dataset/update-sequences.sql"
    })
    public void insertDispositivoMustFail() {

        tenantIdentifierResolver.setUsername("rodrigo.pfontes@bubblemixtea.com.br");

        final Dispositivo dispositivo = new Dispositivo();
        dispositivo.setNome("nome");
        dispositivo.setQuebrarLinhaNaSelecaoDeItemAvaliavel(true);
        dispositivo.setTime((short) 30);
        dispositivo.setSenha(123456L);

        dispositivoService.insertDispositivo(dispositivo);

    }

    /**
     *
     */
    @WithUserDetails("rodrigo.pfontes@bubblemixtea.com.br")
    @Test
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
            "/dataset/fatura.sql", "/dataset/item.sql",
            "/dataset/update-sequences.sql"
    })
    public void insertDispositivoMustPass() {

        tenantIdentifierResolver.setUsername("rodrigo.pfontes@bubblemixtea.com.br");

        final Dispositivo dispositivo = new Dispositivo();
        dispositivo.setNome("nome");
        dispositivo.setQuebrarLinhaNaSelecaoDeItemAvaliavel(true);
        dispositivo.setTime((short) 30);
        dispositivo.setSenha(123456L);

        dispositivoService.insertDispositivo(dispositivo);

        Assert.assertNotNull(dispositivo.getId());
        Assert.assertNotNull(dispositivo.getTenant());
        Assert.assertEquals(tenantIdentifierResolver.resolveCurrentTenantIdentifier(), dispositivo.getTenant());

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
            "/dataset/item.sql",
            "/dataset/update-sequences.sql"
    })
    public void listDispositivosByOperadorMustPass() {

        tenantIdentifierResolver.setUsername("rodrigo.pfontes@bubblemixtea.com.br");

        final List<Dispositivo> dispositivos = dispositivoService.listDispositivosByFilters(null, null).getContent();

        Assert.assertNotNull(dispositivos);
        Assert.assertFalse(dispositivos.isEmpty());
        Assert.assertEquals(3, dispositivos.size());

    }

    /**
     *
     */
    @Test
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
            "/dataset/fatura.sql",
            "/dataset/item.sql",
            "/dataset/update-sequences.sql"
    })
    public void listDispositivosByAdministradorMustPass() {

        tenantIdentifierResolver.setUsername("contato@bubblemixtea.com.br");

        final List<Dispositivo> dispositivos = dispositivoService.listDispositivosByFilters(null, null).getContent();

        Assert.assertNotNull(dispositivos);
        Assert.assertFalse(dispositivos.isEmpty());
        Assert.assertEquals(32, dispositivos.size());

    }

}
