package br.com.ubest.application.converters;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class JsonConverter<T> {

    public  T toObject(final String jsonString, final Class<T> tClass) {

        final ObjectMapper mapper = new ObjectMapper();

        try {
            return mapper.readValue(jsonString, tClass);
        } catch (IOException e) {
            throw new RuntimeException("Invalid JSON:" + jsonString, e);
        }
    }

    public String toJSON(T object) {
        try {
            final ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
