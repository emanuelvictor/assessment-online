package online.meavalia.infrastructure.hibernate.multitenancy;

import online.meavalia.infrastructure.tenant.TenantDetailsService;
import lombok.RequiredArgsConstructor;
import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

@Configuration
@RequiredArgsConstructor
public class FlywaySchemaInitializer {

    private final Flyway flyway;
    
    private final TenantDetailsService tenantDetailsService;
    
    @PostConstruct
    public void migrateFlyway() {
        tenantDetailsService.getAllTenants().forEach( tenant -> {
                flyway.setSchemas(tenant);
                flyway.migrate();
        });
    }
}
