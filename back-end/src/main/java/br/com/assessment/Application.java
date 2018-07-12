package br.com.assessment;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.servlet.WebMvcProperties;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ApplicationListener;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.i18n.LocaleContext;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.Validator;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.server.i18n.LocaleContextResolver;

import java.util.Arrays;
import java.util.Locale;

@EnableAsync
@SpringBootApplication
public class Application extends SpringBootServletInitializer {

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


    /**
     * @param application
     * @return
     */
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }

//    /**
//     * @return
//     */
//    @Bean
//    public MessageSource messageSource() {
        final ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
//        messageSource.setAlwaysUseMessageFormat(true);
//        messageSource.setDefaultEncoding("UTF-8");
//        messageSource.setBasenames("classpath:i18n/exceptions", "classpath:i18n/labels", "classpath:i18n/messages");
//        return messageSource;
//    }

    @Bean
    public MessageSource messageSource() {
        final ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasenames("classpath:i18n/exceptions", "classpath:i18n/labels", "classpath:i18n/messages");
        messageSource.setUseCodeAsDefaultMessage(true);
        messageSource.setDefaultEncoding("UTF-8");
        messageSource.setCacheSeconds(5);
        return messageSource;
    }

//    /**
//     * @return
//     */
//    @Bean
//    public WebMvcProperties.LocaleResolver localeResolver() {
//
//        return WebMvcProperties.LocaleResolver.FIXED;
//    }



    /**
     * @return
     */
    @Bean
    public Validator validator() {
        return new LocalValidatorFactoryBean();
    }


}