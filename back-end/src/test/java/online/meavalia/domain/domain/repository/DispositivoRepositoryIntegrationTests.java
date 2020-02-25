package online.meavalia.domain.domain.repository;

import online.meavalia.domain.AbstractIntegrationTests;
import online.meavalia.domain.entity.unidade.Dispositivo;
import online.meavalia.domain.repository.DispositivoRepository;
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
    public void findByIdMustPass() {
        final Dispositivo dispositivo = dispositivoRepository.findById(3L).orElse(null);
        Assert.assertNotNull(dispositivo);
        Assert.assertNotNull(dispositivo.getNome());
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
    public void findByIdMustReturnNull() {
        final Dispositivo dispositivo = dispositivoRepository.findById(30000L).orElse(null);
        Assert.assertNull(dispositivo);
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
    public void findByCodigoMustPass() {
        final Dispositivo dispositivo = dispositivoRepository.findByCodigo(105782L).orElse(null);
        Assert.assertNotNull(dispositivo);
        Assert.assertNotNull(dispositivo.getNome());
    }

}
