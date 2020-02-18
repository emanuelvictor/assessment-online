package online.meavalia.domain;

import online.meavalia.Application;
import online.meavalia.ApplicationTest;
import org.junit.FixMethodOrder;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.transaction.BeforeTransaction;

@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@FixMethodOrder(MethodSorters.JVM)
@SpringBootTest(classes = {ApplicationTest.class, Application.class})
public abstract class AbstractIntegrationTests {

    /**
     *
     */
    @BeforeTransaction
    public void beforeTransaction() {
        System.out.println("beforeTransaction");
    }
}
