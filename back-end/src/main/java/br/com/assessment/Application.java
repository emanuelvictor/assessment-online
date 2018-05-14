package br.com.assessment;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;

@EnableAsync
@SpringBootApplication
public class Application {

    private static final Logger LOGGER = LoggerFactory.getLogger(Application.class);

    /**
     *
     * @param args
     */
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    /**
     *
     */
    public static final String AUDIT_SCHEMA = "auditing";

    /**
     *
     * Exibe o perfil da aplicação quando a mesma inicia
     *
     * @return
     */
    @Bean
    public ApplicationListener<ApplicationReadyEvent> getApplicationReadyEvent() {
        return applicationReadyEvent -> {
            LOGGER.info("--------------------------------------------------");

//            Arrays.asList(applicationReadyEvent.getApplicationContext().getEnvironment().getActiveProfiles()).forEach(LOGGER::info);
            Arrays.asList(applicationReadyEvent.getApplicationContext().getEnvironment().getActiveProfiles()).forEach(profile ->
                    LOGGER.info("Sistema iniciado com o profile de configuração: {}", profile)
            );
            LOGGER.info("--------------------------------------------------");
        };
    }


    /**
     *
     * Bean de criptografia
     *
     * @return
     */
    @Bean
    PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

}