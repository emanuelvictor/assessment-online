package br.com.ubest.application.context;

import org.springframework.data.domain.Pageable;

public final class LocalContext {

    public static final String DEFAULT_TENANT_ID = "public";

    private static String rootCurrentScheme;

    private static String currentScheme;

    private static String currentUsername;

    private static Pageable pageable;

    /**
     * --------------------------
     * rootCurrentScheme
     * --------------------------
     */
    public static String getRootCurrentScheme() {
        if (rootCurrentScheme != null)
            return rootCurrentScheme;
        return DEFAULT_TENANT_ID;
    }

    public static void setRootCurrentScheme(final String tenant) {
        if (rootCurrentScheme == null)
            rootCurrentScheme = DEFAULT_TENANT_ID;
        rootCurrentScheme = removeNoCache(tenant);
    }

    /**
     * --------------------------
     * currentScheme
     * --------------------------
     */
    public static String getCurrentScheme() {
        if (currentScheme != null)
            return currentScheme;
        return DEFAULT_TENANT_ID;
    }

    public static void setCurrentScheme(final String tenant) {
        if (currentScheme == null)
            currentScheme = DEFAULT_TENANT_ID;
        currentScheme = removeNoCache(tenant);
    }

    private static String removeNoCache(final String schema) {
        if (schema.contains("?nocache"))
            return schema.replace(schema.substring(schema.indexOf("?nocache")), "");
        return schema;
    }

    public static void clearCurrentSchema() {
        currentScheme = null;
    }

    /**
     * --------------------------
     * currentUsername
     * --------------------------
     */
    public static String getCurrentUsername() {
        return currentUsername;
    }

    public static void setCurrentUsername(final String username) {
        currentUsername = username;
    }

    public static void clearCurrentUsername() {
        currentUsername = null;
    }

    /**
     * --------------------------
     * pageable
     * --------------------------
     */
    public static Pageable getPageable() {
        return pageable;
    }

    public static void setPageable(final Pageable pageable) {
        LocalContext.pageable = pageable;
    }
}
