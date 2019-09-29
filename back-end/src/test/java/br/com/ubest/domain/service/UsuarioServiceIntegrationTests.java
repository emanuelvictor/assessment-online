package br.com.ubest.domain.service;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class UsuarioServiceIntegrationTests extends AbstractIntegrationTests {

    @Autowired
    private UsuarioService usuarioService;

    @Test
    public void bootstrapTemplate() {
        usuarioService.bootstrapTemplate(true);
    }
}
