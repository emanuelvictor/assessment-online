package br.com.ubest.application.hibernate;

import br.com.ubest.application.multitenancy.TenantIdentifierResolver;
import org.hibernate.EmptyInterceptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.Serializable;

public class EmptyInterceptorConfig extends EmptyInterceptor {

    private final TenantIdentifierResolver tenantIdentifierResolver;

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    public EmptyInterceptorConfig(TenantIdentifierResolver tenantIdentifierResolver) {
        this.tenantIdentifierResolver = tenantIdentifierResolver;
    }

    @Override
    public boolean onFlushDirty(Object entity, Serializable id, Object[] currentState, Object[] previousState,
                                String[] propertyNames, org.hibernate.type.Type[] types) {
        return this.handleTenant(entity, id, currentState, propertyNames, types);
    }

    @Override
    public boolean onSave(Object entity, Serializable id, Object[] state, String[] propertyNames,
                          org.hibernate.type.Type[] types) {
        return this.handleTenant(entity, id, state, propertyNames, types);
    }

    private boolean handleTenant(Object entity, Serializable id, Object[] currentState, String[] propertyNames,
                                 org.hibernate.type.Type[] types) {

        int index = ArrayUtil.indexOf(propertyNames, "tenant");
        if (index < 0) {
            return false;
        }

        String activeTenantId = this.tenantIdentifierResolver.resolveCurrentTenantIdentifier();
        Object tenantId = currentState[index];

        // on a new entity, set tenant id to current tenant
        if (tenantId == null || tenantId.toString().isEmpty()) {
            currentState[index] = activeTenantId;
            return true;
        }

        // on update, block cross tenant attempt
        else if (!tenantId.equals(activeTenantId)) {
//            throw new RuntimeException( TODO
//                    "cross tenant update, tenantId=" + tenantId + ", activeTenantId=" + activeTenantId);
        }

        return true;
    }

    static class ArrayUtil {

        public static <T> boolean isEmpty(T[] a) {
            return a == null || a.length == 0;
        }

        public static <T> int indexOf(T[] array, T object) {
            int i = 0;
            for (T t : array) {
                if (t == object || t.equals(object))
                    return i;
                i++;
            }
            return -1;
        }
    }
}
