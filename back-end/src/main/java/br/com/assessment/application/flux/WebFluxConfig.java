package br.com.assessment.application.flux;

import br.com.assessment.application.converters.LocalDateConverter;
import br.com.assessment.application.converters.LocalDateTimeConverter;
import br.com.assessment.application.formatter.LocalDateFormatter;
import br.com.assessment.application.formatter.LocalDateTimeFormatter;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.reactive.config.WebFluxConfigurer;

import static br.com.assessment.application.formatter.LocalDateFormatter.LOCAL_DATE_PATTERN;
import static br.com.assessment.application.formatter.LocalDateTimeFormatter.LOCAL_DATE_TIME_PATTERN;

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


}