package online.meavalia.domain.service.domain.repository;

import online.meavalia.domain.entity.unidade.Dispositivo;
import online.meavalia.domain.repository.DispositivoRepository;
import online.meavalia.domain.service.AbstractIntegrationTests;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

public class DispositivoRepositoryIntegrationTests extends AbstractIntegrationTests {

    /**
     *
     */
    @Autowired
    private DispositivoRepository dispositivoRepository;

    /**
     *
     */
    @Test
    @Sql({"/dataset/plano.sql", "/dataset/assinatura.sql", "/dataset/dispositivo.sql"})
    public void findByIdMustPass() {
        final Dispositivo dispositivo = dispositivoRepository.findById(3L).orElseThrow();
        Assert.assertNotNull(dispositivo.getNome());
    }

    /**
     *
     */
    @Test(expected = java.util.NoSuchElementException.class)
    @Sql({"/dataset/plano.sql", "/dataset/assinatura.sql", "/dataset/dispositivo.sql"})
    public void findByIdMustFail() {
        final Dispositivo dispositivo = dispositivoRepository.findById(30000L).orElseThrow();
        Assert.assertNotNull(dispositivo.getNome());
    }

    /**
     *
     */
    @Test
    @Sql({"/dataset/plano.sql", "/dataset/assinatura.sql", "/dataset/dispositivo.sql"})
    public void findByCodigoMustPass() {
        final Dispositivo dispositivo = dispositivoRepository.findByCodigo(105782L).orElseThrow();
        Assert.assertNotNull(dispositivo.getNome());
    }

}
