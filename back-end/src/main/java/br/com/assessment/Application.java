package br.com.assessment;

import br.com.assessment.application.flux.WebFluxConfig;
import br.com.assessment.application.handlers.LoginFailureHandler;
import br.com.assessment.application.handlers.LoginSuccessHandler;
import br.com.assessment.application.handlers.LogoutSuccessHandler;
import br.com.assessment.application.security.AuthenticationManager;
import br.com.assessment.application.security.PasswordEncoderConfiguration;
import br.com.assessment.application.security.SecurityConfiguration;
import br.com.assessment.domain.repository.ContaRepository;
import br.com.assessment.domain.service.ContaService;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.hibernate5.Hibernate5Module;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationListener;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.server.reactive.HttpHandler;
import org.springframework.http.server.reactive.ReactorHttpHandlerAdapter;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.validation.Validator;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.reactive.support.AbstractAnnotationConfigDispatcherHandlerInitializer;
import org.springframework.web.server.adapter.AbstractReactiveWebInitializer;
import org.springframework.web.server.adapter.WebHttpHandlerBuilder;
import reactor.ipc.netty.NettyContext;
import reactor.ipc.netty.http.server.HttpServer;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.util.Assert;
import org.springframework.web.server.adapter.AbstractReactiveWebInitializer;
import javax.servlet.MultipartConfigElement;
import java.util.Arrays;

@EnableAsync
@SpringBootApplication
public class Application extends AbstractReactiveWebInitializer {

    private static final Logger LOGGER = LoggerFactory.getLogger(Application.class);

    @Override
    protected ApplicationContext createApplicationContext() {
        Class<?>[] configClasses = getConfigClasses();
        Assert.notEmpty(configClasses, "No Spring configuration provided.");
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(configClasses);
        return context;
    }
    
    @Override
    protected Class<?>[] getConfigClasses() {
        return new Class[]{
        		LogoutSuccessHandler.class,
        		LoginSuccessHandler.class,
        		LoginFailureHandler.class,
        		PasswordEncoderConfiguration.class,
        		ContaService.class,
        		AuthenticationManager.class,
                SecurityConfiguration.class,
                WebFluxConfig.class,
        };
    }

    /**
     */
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }


    /**
     * Exibe o perfil da aplicação quando a mesma inicia
     *
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

//    @Bean
//    public NettyContext nettyContext(ApplicationContext context) {
//        HttpHandler handler = WebHttpHandlerBuilder
//                .applicationContext(context).build();
//        ReactorHttpHandlerAdapter adapter
//                = new ReactorHttpHandlerAdapter(handler);
//        HttpServer httpServer = HttpServer.create("localhost", 8080);
//        return httpServer.newHandler(adapter).block();
//    }


//    /**
//     */
//    @Override
//    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
//        return application.sources(Application.class);
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



    /**
     *
     */
    @Bean
    public MultipartConfigElement multipartConfigElement() {
        return new MultipartConfigElement("");
    }

    /**
     *
     */
    @Bean
    public MultipartResolver multipartResolver() {
        final CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
        multipartResolver.setMaxUploadSize(3 * 1024 * 1024);
        return multipartResolver;
    }

    /**
     */
    @Bean
    public Validator validator() {
        return new LocalValidatorFactoryBean();
    }

}