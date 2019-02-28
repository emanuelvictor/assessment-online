package br.com.ubest.application.context;

import org.springframework.data.domain.Pageable;

public final class LocalContext {

    public static final String DEFAULT_TENANT_ID = "public";

    private static Pageable pageable;

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
