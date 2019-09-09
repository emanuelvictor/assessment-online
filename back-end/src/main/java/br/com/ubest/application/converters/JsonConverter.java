package br.com.ubest.application.converters;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class JsonConverter<T> {

    private final Class<T> tClass;

    private final ObjectMapper mapper;

    public JsonConverter(final Class<T> tClass, final ObjectMapper objectMapper) {
        this.tClass = tClass; //getGenericTypeClass();// (Class<T>) Class.forName(this.getClass().getTypeName());
        this.mapper = objectMapper;
    }

    public T toObject(final String jsonString) {

        try {
            return mapper.readValue(jsonString, tClass);
        } catch (IOException e) {
            throw new RuntimeException("Invalid JSON:" + jsonString, e);
        }
    }

    public String toJSON(T object) {
        try {
            return mapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
