package online.meavalia.domain.service;

import online.meavalia.Application;
import online.meavalia.ApplicationTest;
import org.junit.FixMethodOrder;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.BeforeTransaction;

@ActiveProfiles("test")
@FixMethodOrder(MethodSorters.JVM)
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = {ApplicationTest.class, Application.class})
public abstract class AbstractIntegrationTests {

    @BeforeTransaction
    public void beforeTransaction(){
        System.out.println("beforeTransaction");
    }
}
