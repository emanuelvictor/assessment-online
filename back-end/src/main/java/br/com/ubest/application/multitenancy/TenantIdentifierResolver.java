package br.com.ubest.application.multitenancy;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import static br.com.ubest.Application.DEFAULT_TENANT_ID;
import static br.com.ubest.infrastructure.suport.Utils.removeNoCache;

@Component
@RequiredArgsConstructor
public class TenantIdentifierResolver {

    private String username;

    private String schema = DEFAULT_TENANT_ID;

    public String resolveCurrentTenantIdentifier() {
        return schema;
    }

    public void setSchema(final String schema) {
        this.schema = removeNoCache(schema);
    }

    public void setUsername(final String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

}
