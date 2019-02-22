package br.com.ubest.application.context;

import org.springframework.data.domain.Pageable;

import java.util.HashMap;
import java.util.Map;

public final class LocalContext {

    public static final String DEFAULT_TENANT_ID = "public";

    private static Map<String, String> rootCurrentScheme;

    private static String currentScheme;

    private static String currentUsername;

    private static Pageable pageable;

    /**
     * --------------------------
     * rootCurrentScheme
     * --------------------------
     */
    public static String getRootCurrentScheme(final String account) {
        if (rootCurrentScheme != null && rootCurrentScheme.get(account) != null)
            return rootCurrentScheme.get(account);
        return DEFAULT_TENANT_ID;
    }

    public static void addRootCurrentScheme(final String account, final String tenant) {
        if (rootCurrentScheme != null && rootCurrentScheme.get(account) != null)
            rootCurrentScheme.put(account, DEFAULT_TENANT_ID);
        if (rootCurrentScheme == null) rootCurrentScheme = new HashMap<>();
        rootCurrentScheme.put(account, removeNoCache(tenant));
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
