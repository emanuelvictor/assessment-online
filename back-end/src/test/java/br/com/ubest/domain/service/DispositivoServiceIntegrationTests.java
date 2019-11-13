package br.com.ubest.domain.service;

import br.com.ubest.domain.entity.unidade.Dispositivo;
import br.com.ubest.domain.repository.DispositivoRepository;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

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
        final Dispositivo dispositivo = dispositivoRepository.findByCodigo(UUID.fromString("733def0e-1f4e-471d-9648-713970299f20"));
        Assert.assertNotNull(dispositivo);
        Assert.assertNotNull(dispositivo.getNome());
    }

    /**
     *
     */
    @Test
    @Sql({"/dataset/planos.sql", "/dataset/assinaturas.sql", "/dataset/dispositivos.sql"})
    public void getDispositivoByCodigoMustPass() {
        final Map<String, Object> licencaESenha = dispositivoService.getLicencaAndSenhaByCodigo("733def0e-1f4e-471d-9648-713970299f20", "100000");
//        Assert.assertNotNull(dispositivo.getNome());
    }

}
