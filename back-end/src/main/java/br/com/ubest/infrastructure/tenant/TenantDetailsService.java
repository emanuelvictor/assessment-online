package br.com.ubest.infrastructure.tenant;

import org.springframework.security.core.userdetails.ReactiveUserDetailsService;

public interface TenantDetailsService extends ReactiveUserDetailsService {

    TenantDetails findTenantDetailsByUsername(String username);

}
