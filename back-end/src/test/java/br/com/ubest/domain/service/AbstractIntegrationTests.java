package br.com.ubest.domain.service;

import br.com.ubest.Application;
import br.com.ubest.ApplicationTest;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@ActiveProfiles("test")
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = {ApplicationTest.class, Application.class})
public abstract class AbstractIntegrationTests {

}
