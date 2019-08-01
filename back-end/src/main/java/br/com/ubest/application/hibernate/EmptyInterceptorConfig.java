package br.com.ubest.application.hibernate;

import br.com.ubest.application.multitenancy.TenantIdentifierResolver;
import br.com.ubest.domain.entity.generic.AbstractEntity;
import lombok.RequiredArgsConstructor;
import org.hibernate.EmptyInterceptor;
import org.hibernate.Transaction;
import org.hibernate.type.Type;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.Serializable;

public class EmptyInterceptorConfig extends EmptyInterceptor {

    private final TenantIdentifierResolver tenantIdentifierResolver;

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    public EmptyInterceptorConfig(TenantIdentifierResolver tenantIdentifierResolver) {
        this.tenantIdentifierResolver = tenantIdentifierResolver;
    }

    @Override
    public boolean onSave(final Object entity, Serializable id, Object[] state, String[] propertyNames, Type[] types) {
//        log.debug("[save] Updating the entity " + id + " with util information: " + tenantIdentifierResolver.resolveCurrentTenantIdentifier());
        ((AbstractEntity) entity).setTenant(tenantIdentifierResolver.resolveCurrentTenantIdentifier());
        return true;
    }

    @Override
    public void onDelete(Object entity, Serializable id, Object[] state, String[] propertyNames, Type[] types) {
        log.debug("[delete] Updating the entity " + id + " with util information: " + tenantIdentifierResolver.resolveCurrentTenantIdentifier());
        ((AbstractEntity) entity).setTenant(tenantIdentifierResolver.resolveCurrentTenantIdentifier());
    }

    @Override
    public boolean onFlushDirty(Object entity, Serializable id, Object[] currentState, Object[] previousState, String[] propertyNames, Type[] types) {
        log.debug("[flush-dirty] Updating the entity " + id + " with util information: " + tenantIdentifierResolver.resolveCurrentTenantIdentifier());
        ((AbstractEntity) entity).setTenant(tenantIdentifierResolver.resolveCurrentTenantIdentifier());
        return false;
    }

}
