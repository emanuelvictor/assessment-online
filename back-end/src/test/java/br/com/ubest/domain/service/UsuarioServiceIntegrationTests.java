package br.com.ubest.domain.service;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.util.Assert;

public class UsuarioServiceIntegrationTests extends AbstractIntegrationTests {
	
	/**
	 * 
	 */
	@Autowired
	private UsuarioService usuarioService;

	/**
	 *
	 */
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

    /**
     *
     */
	@Test
    public void teste() {
		System.out.println(bCryptPasswordEncoder.encode("bm129000"));
		Assert.isTrue(bCryptPasswordEncoder.matches("bm129000", "$2a$10$NbtZRkg8a97Ulr6SMYFM/O0tP3eBzwuYdmURSSuoJpjGWw39okuRy"), "Encodes diferentes");
    }
    
}
