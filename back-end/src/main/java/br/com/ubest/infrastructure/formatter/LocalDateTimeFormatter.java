package br.com.ubest.infrastructure.formatter;

import org.springframework.format.Formatter;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class LocalDateTimeFormatter implements Formatter<LocalDateTime> {

    public static String LOCAL_DATE_TIME_PATTERN = "dd/MM/yyyy HH:mm:ss";

    private String pattern;

    public LocalDateTimeFormatter(final String pattern) {
        this.pattern = pattern;
    }

    @Override
    public LocalDateTime parse(final String text, final Locale locale) throws ParseException {
        assert this.pattern != null;

        final DateTimeFormatter formatter = DateTimeFormatter.ofPattern(this.pattern, locale);

        if (!text.contains(":")) {
            return LocalDateTime.parse(text + " 00:00:01", formatter);
        }

        return LocalDateTime.parse(text, formatter);
    }

    @Override
    public String print(final LocalDateTime object, final Locale locale) {
        assert this.pattern != null;
        final DateTimeFormatter formatter = DateTimeFormatter.ofPattern(this.pattern, locale);
        return object.format(formatter);
    }
}
