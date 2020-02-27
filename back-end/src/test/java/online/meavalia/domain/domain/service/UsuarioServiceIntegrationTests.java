package online.meavalia.domain.domain.service;

import online.meavalia.domain.AbstractIntegrationTests;
import online.meavalia.domain.service.UsuarioService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

public class UsuarioServiceIntegrationTests extends AbstractIntegrationTests {

    @Autowired
    private UsuarioService usuarioService;

    @Test
    @Sql({
            "/dataset/truncate-all-tables.sql",
    })
    public void bootstrapTemplate() {
        usuarioService.bootstrapTemplate();
    }
}
