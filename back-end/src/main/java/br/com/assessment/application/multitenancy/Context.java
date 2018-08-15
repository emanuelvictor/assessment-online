package br.com.assessment.application.multitenancy;

public class Context {

    public static final String DEFAULT_TENANT_ID = "public";

    private static ThreadLocal<String> currentSchema = new ThreadLocal<>();

    private static ThreadLocal<String> currentUsername = new ThreadLocal<>();

    public static void setCurrentSchema(final String tenant) {
        currentSchema.set(tenant);
    }

    public static String getCurrentSchema() {
        if (currentSchema.get() != null)
            return currentSchema.get();
        return DEFAULT_TENANT_ID;
    }

    public static void clearCurrentSchema() {
        currentSchema.set(null);
    }

    public static void setCurrentUsername(final String username) {
        currentUsername.set(username);
    }

    public static String getCurrentUsername() {
        return currentUsername.get();
    }

    public static void clearCurrentUsername() {
        currentUsername.set(null);
    }
}
