package online.meavalia.infrastructure.hibernate.multitenancy;

import lombok.RequiredArgsConstructor;
import online.meavalia.infrastructure.tenant.TenantDetailsService;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.configuration.FluentConfiguration;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;

@Configuration
@RequiredArgsConstructor
public class FlywaySchemaInitializer {

    /**
     *
     */
    private final Flyway flyway;

    /**
     *
     */
    private final DataSource dataSource;

    /**
     *
     */
    private final TenantDetailsService tenantDetailsService;

    /**
     *
     */
    @PostConstruct
    public void migrateFlyway() {
        tenantDetailsService.getAllTenants().forEach(this::migrate);
    }

    /**
     * Migrates the tenant.
     *
     * @param tenant
     */
    public void migrate(final String tenant) {
        new FluentConfiguration().configuration(flyway.getConfiguration()).schemas(tenant).load().migrate();
    }
}
