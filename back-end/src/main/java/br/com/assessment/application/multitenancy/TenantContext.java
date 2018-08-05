package br.com.assessment.application.multitenancy;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TenantContext {
    private static Logger logger = LoggerFactory.getLogger(TenantContext.class.getName());
    private static ThreadLocal<String> currentTenant = new ThreadLocal<>();

    public static void setCurrentTenant(final long tenant) {
        logger.debug("Setting tenant to " + Long.toString(tenant));
        currentTenant.set(Long.toString(tenant));
    }

    public static void setCurrentTenant(final String tenant) {
        logger.debug("Setting tenant to " + tenant);
        currentTenant.set(tenant);
    }

    public static String getCurrentTenant() {
        return currentTenant.get();
    }

    public static void clear() {
        currentTenant.set(null);
    }
}
