package online.meavalia.infrastructure.tenant;

import org.springframework.security.core.userdetails.ReactiveUserDetailsService;

public interface TenantDetailsService extends ReactiveUserDetailsService {

    TenantDetails findTenantDetailsByUsername(final String username);

    TenantDetails findTenantDetailsBySessionId(final String sessionId);

    Iterable<String> getAllTenants();
}
