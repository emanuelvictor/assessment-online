package br.com.assessment.application.context;

import org.springframework.data.domain.Pageable;

public final class LocalContext {

//    private static final LocalContext INSTANCE = new LocalContext();
//
//    private LocalContext() {
//    }
//
//    LocalContext getInstance() {
//        return INSTANCE;
//    }

    public static final String DEFAULT_TENANT_ID = "public";

    private static String currentSchema;

    private static String currentUsername;

    private static Pageable pageable;

    /**
     * --------------------------
     * pageable
     * --------------------------
     */
    public static String getCurrentSchema() {
        if (currentSchema != null)
            return currentSchema;
        return DEFAULT_TENANT_ID;
    }

    public static void setCurrentSchema(final String tenant) {
        if (currentSchema == null)
            currentSchema = DEFAULT_TENANT_ID;
        currentSchema = removeNoCache(tenant);
    }

    private static String removeNoCache(final String schema) {
        if (schema.contains("?nocache"))
            return schema.replace(schema.substring(schema.indexOf("?nocache")), "");
        return schema;
    }

    public static void clearCurrentSchema() {
        currentSchema = null;
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
