package online.meavalia.infrastructure.tenant;

import org.springframework.security.core.userdetails.UserDetails;

public interface TenantDetails extends UserDetails {

    String getTenant();

}
