package online.meavalia.domain.service.domain.service;

import online.meavalia.domain.service.AbstractIntegrationTests;
import online.meavalia.domain.service.UsuarioService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class UsuarioServiceIntegrationTests extends AbstractIntegrationTests {

    @Autowired
    private UsuarioService usuarioService;

    @Test
    public void bootstrapTemplate() {
        usuarioService.bootstrapTemplate();
    }
}
