package br.com.assessment.application.flux;

import static br.com.assessment.application.formatter.LocalDateFormatter.LOCAL_DATE_PATTERN;
import static br.com.assessment.application.formatter.LocalDateTimeFormatter.LOCAL_DATE_TIME_PATTERN;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.reactive.config.ViewResolverRegistry;
import org.springframework.web.reactive.config.WebFluxConfigurer;

import br.com.assessment.application.formatter.LocalDateFormatter;
import br.com.assessment.application.formatter.LocalDateTimeFormatter;
import org.springframework.web.reactive.result.view.freemarker.FreeMarkerConfigurer;

@Configuration
@EnableWebFlux
public class WebFluxConfig implements WebFluxConfigurer {

    /**
     * @param registry FormatterRegistry
     */
    @Override
    public void addFormatters(final FormatterRegistry registry) {
//        registry.addConverter(new LocalDateConverter(LOCAL_DATE_PATTERN));
//        registry.addConverter(new LocalDateTimeConverter(LOCAL_DATE_TIME_PATTERN));

        registry.addFormatter(new LocalDateFormatter(LOCAL_DATE_PATTERN));
        registry.addFormatter(new LocalDateTimeFormatter(LOCAL_DATE_TIME_PATTERN));
    }

    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
        registry.freeMarker();
    }

    // Configure FreeMarker...

    @Bean
    public FreeMarkerConfigurer freeMarkerConfigurer() {



        FreeMarkerConfigurer configurer = new FreeMarkerConfigurer();
        configurer.setTemplateLoaderPath("classpath:/public");


        return configurer;
    }
}