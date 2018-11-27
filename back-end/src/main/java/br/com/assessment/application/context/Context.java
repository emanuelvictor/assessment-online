package br.com.assessment.application.context;

import org.springframework.data.domain.Pageable;

public class Context {

    public static final String DEFAULT_TENANT_ID = "public";

    private static ThreadLocal<String> currentSchema = new ThreadLocal<>();

    private static ThreadLocal<String> currentUsername = new ThreadLocal<>();

    private static ThreadLocal<Pageable> pageable = new ThreadLocal<>();

    public static String getCurrentSchema() {
        if (currentSchema != null && currentSchema.get() != null)
            return currentSchema.get();
        return DEFAULT_TENANT_ID;
    }

    public static void setCurrentSchema(final String tenant) {
        if (currentSchema == null)
            currentSchema = new ThreadLocal<>();
        currentSchema.set(tenant);
    }

    public static void clearCurrentSchema() {
        currentSchema = null;
    }

    public static String getCurrentUsername() {
        return currentUsername != null ? currentUsername.get() : null;
    }

    public static void setCurrentUsername(final String username) {
        if (currentUsername == null)
            currentUsername = new ThreadLocal<>();
        currentUsername.set(username);
    }

    public static void clearCurrentUsername() {
        currentUsername = null;
    }

    public static Pageable getPageable() {
        return pageable.get();
    }

    public static void setPageable(Pageable pageable) {
        Context.pageable.set(pageable);
    }
}
