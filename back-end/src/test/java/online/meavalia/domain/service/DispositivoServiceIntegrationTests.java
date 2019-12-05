package online.meavalia.domain.service;

import online.meavalia.domain.entity.unidade.Dispositivo;
import online.meavalia.domain.repository.DispositivoRepository;
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
    @Autowired
    private DispositivoRepository dispositivoRepository;

    /**
     *
     */
    @Test
    @Sql({"/dataset/planos.sql", "/dataset/assinaturas.sql", "/dataset/dispositivos.sql"})
    public void findByIdMustPass() {
        final Dispositivo dispositivo = dispositivoRepository.findById(3L).orElseThrow();
        Assert.assertNotNull(dispositivo.getNome());
    }

    /**
     *
     */
    @Test(expected = java.util.NoSuchElementException.class)
    @Sql({"/dataset/planos.sql", "/dataset/assinaturas.sql", "/dataset/dispositivos.sql"})
    public void findByIdMustFail() {
        final Dispositivo dispositivo = dispositivoRepository.findById(30000L).orElseThrow();
        Assert.assertNotNull(dispositivo.getNome());
    }

    /**
     *
     */
    @Test
    @Sql({"/dataset/planos.sql", "/dataset/assinaturas.sql", "/dataset/dispositivos.sql"})
    public void findByIdFromServiceMustPass() {
        final Dispositivo dispositivo = dispositivoService.getDispositivo(3L);
        Assert.assertNotNull(dispositivo.getNome());
    }

    /**
     *
     */
    @Test(expected = java.lang.IllegalArgumentException.class)
    @Sql({"/dataset/planos.sql", "/dataset/assinaturas.sql", "/dataset/dispositivos.sql"})
    public void findByIdFromServiceMustFail() {
        final Dispositivo dispositivo = dispositivoService.getDispositivo(300444L);
        Assert.assertNotNull(dispositivo.getNome());
    }


    /**
     *
     */
    @Test
    @Sql({"/dataset/planos.sql", "/dataset/assinaturas.sql", "/dataset/dispositivos.sql"})
    public void findByCodigoMustPass() {
        final Dispositivo dispositivo = dispositivoRepository.findByCodigo(105782L).orElseThrow();
        Assert.assertNotNull(dispositivo.getNome());
    }

}
