package br.com.assessment.application.flux;

import br.com.assessment.application.formatter.LocalDateFormatter;
import br.com.assessment.application.formatter.LocalDateTimeFormatter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.reactive.config.ViewResolverRegistry;
import org.springframework.web.reactive.config.WebFluxConfigurer;
import org.springframework.web.reactive.result.view.freemarker.FreeMarkerConfigurer;

import static br.com.assessment.application.formatter.LocalDateFormatter.LOCAL_DATE_PATTERN;
import static br.com.assessment.application.formatter.LocalDateTimeFormatter.LOCAL_DATE_TIME_PATTERN;

@Configuration
@EnableWebFlux
public class WebFluxConfig implements WebFluxConfigurer {

    private static final String HTML_SUFFIX = ".html";

    @Override
    public void addFormatters(final FormatterRegistry registry) {
        registry.addFormatter(new LocalDateFormatter(LOCAL_DATE_PATTERN));
        registry.addFormatter(new LocalDateTimeFormatter(LOCAL_DATE_TIME_PATTERN));
    }

    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
        registry.freeMarker().suffix(HTML_SUFFIX);

    }

    @Bean
    public FreeMarkerConfigurer freeMarkerConfigurer() {
        final FreeMarkerConfigurer configurer = new FreeMarkerConfigurer();
        configurer.setTemplateLoaderPath("classpath:/public");
        return configurer;
    }
}