package br.com.ubest.application.formatter;

import org.springframework.format.Formatter;

import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class LocalDateFormatter implements Formatter<LocalDate> {

    public static String LOCAL_DATE_PATTERN = "dd/MM/yyyy";

    private String pattern;

    public LocalDateFormatter(final String pattern) {
        this.pattern = pattern;
    }

    @Override
    public LocalDate parse(final String text, final Locale locale) throws ParseException {
        assert this.pattern != null;
        final DateTimeFormatter formatter = DateTimeFormatter.ofPattern(this.pattern, locale);
        return LocalDate.parse(text, formatter);
    }

    @Override
    public String print(final LocalDate object, final Locale locale) {
        assert this.pattern != null;
        final DateTimeFormatter formatter = DateTimeFormatter.ofPattern(this.pattern, locale);
        return object.format(formatter);
    }
}
