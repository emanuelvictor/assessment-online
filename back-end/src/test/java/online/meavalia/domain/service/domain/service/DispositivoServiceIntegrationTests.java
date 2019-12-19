package online.meavalia.domain.service.domain.service;

import online.meavalia.domain.entity.unidade.Dispositivo;
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
    @Sql({"/dataset/planos.sql", "/dataset/assinaturas.sql", "/dataset/dispositivos.sql"})
    public void getDispositivoByIdMustPass() {
        final Dispositivo dispositivo = dispositivoService.getDispositivoByIdOrCodigo(3L);
        Assert.assertNotNull(dispositivo.getNome());
    }

    /**
     *
     */
    @Test(expected = java.lang.IllegalArgumentException.class)
    @Sql({"/dataset/planos.sql", "/dataset/assinaturas.sql", "/dataset/dispositivos.sql"})
    public void getDispositivoByIdMustFail() {
        dispositivoService.getDispositivoByIdOrCodigo(300444L);
    }

    /**
     *
     */
    @Test
    @Sql({"/dataset/planos.sql", "/dataset/assinaturas.sql", "/dataset/dispositivos.sql"})
    public void getDispositivoByCodigoMustPass() {
        final Dispositivo dispositivo = dispositivoService.getDispositivoByIdOrCodigo(105782L);
        Assert.assertNotNull(dispositivo.getNome());
    }

    /**
     *
     */
    @Test(expected = java.lang.IllegalArgumentException.class)
    @Sql({"/dataset/planos.sql", "/dataset/assinaturas.sql", "/dataset/dispositivos.sql"})
    public void updateStatusAtivoWithDispositivoDesativadoMustFail() {
        final Dispositivo dispositivo = dispositivoService.getDispositivoByIdOrCodigo(3L);
        Assert.assertFalse(dispositivo.isEnabled());
        dispositivoService.updateStatusAtivo(dispositivo.getId());
    }

    /**
     *
     */
    @Test
    @Sql({"/dataset/planos.sql", "/dataset/assinaturas.sql", "/dataset/dispositivos.sql"})
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
    @Sql({"/dataset/planos.sql", "/dataset/assinaturas.sql", "/dataset/dispositivos.sql"})
    public void reativarDispositivoMustPass(){
       this.updateStatusAtivoWithDispositivoDesativadoMustPass();
    }

    /**
     *
     */
    @Test(expected = java.lang.IllegalArgumentException.class)
    @Sql({"/dataset/planos.sql", "/dataset/assinaturas.sql", "/dataset/dispositivos.sql"})
    public void updateDispositivoDesativadoMustFail() {
        final Dispositivo dispositivo = dispositivoService.getDispositivoByIdOrCodigo(3L);
        Assert.assertFalse(dispositivo.isEnabled());
        dispositivoService.updateDispositivo(dispositivo.getId(), dispositivo);
    }

//    saveUnidadesTiposAvaliacoesDispositivo TODO

}
