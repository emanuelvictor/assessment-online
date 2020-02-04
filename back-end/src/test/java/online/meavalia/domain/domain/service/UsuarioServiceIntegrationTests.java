package online.meavalia.domain.domain.service;

import online.meavalia.domain.AbstractIntegrationTests;
import online.meavalia.domain.UsuarioService;
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
