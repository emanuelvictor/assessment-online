package online.meavalia.application.tenant;

import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.stereotype.Component;

import static online.meavalia.Application.DEFAULT_TENANT_ID;
import static online.meavalia.infrastructure.suport.Utils.removeNoCache;

@Component
public class TenantIdentifierResolver implements CurrentTenantIdentifierResolver {

    private String username;

    private String schema = DEFAULT_TENANT_ID;

    @Override
    public String resolveCurrentTenantIdentifier() {
        return schema;
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
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
