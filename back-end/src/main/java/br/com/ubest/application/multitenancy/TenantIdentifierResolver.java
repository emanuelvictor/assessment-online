package br.com.ubest.application.multitenancy;

import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;

import static br.com.ubest.Application.DEFAULT_TENANT_ID;
import static br.com.ubest.Application.SCHEMA_NAME;
import static br.com.ubest.infrastructure.suport.Utils.removeNoCache;

@Component
@RequiredArgsConstructor
@Transactional
public class TenantIdentifierResolver
//        implements CurrentTenantIdentifierResolver
{

    private String username;

    private String schema = DEFAULT_TENANT_ID;

//    private final EntityManager entityManager;

//    @Override
    public String resolveCurrentTenantIdentifier() {
        return schema;
    }

//    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }

    public void setSchema(final String schema) {
        this.schema = removeNoCache(schema);

//        org.hibernate.Filter filter = entityManager.unwrap(Session.class).enableFilter("tenantFilter");
//        filter.setParameter("tenant", this.schema);
//        filter.validate();
    }

    public void setUsername(final String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

}
