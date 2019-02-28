package br.com.ubest.application.multitenancy;

import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.stereotype.Component;

@Component
public class TenantIdentifierResolver implements CurrentTenantIdentifierResolver {

    private String username;

    private String schema = "public";

    @Override
    public String resolveCurrentTenantIdentifier() {
        return schema;
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }

    public void setSchema(final String schema)
    {
        this.schema = removeNoCache(schema);
    }

    public void setUsername(final String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    private static String removeNoCache(final String schema) {
        if (schema.contains("?nocache"))
            return schema.replace(schema.substring(schema.indexOf("?nocache")), "");
        return schema;
    }

}
