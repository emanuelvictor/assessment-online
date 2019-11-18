package online.meavalia.infrastructure.hibernate;

import online.meavalia.application.tenant.TenantIdentifierResolver;
import online.meavalia.infrastructure.hibernate.multitenancy.MultiTenantConnectionProviderImpl;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.hibernate.MultiTenancyStrategy;
import org.hibernate.cfg.Environment;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.util.HashMap;

@Configuration
@RequiredArgsConstructor
public class HibernateConfig {

    private final org.springframework.core.env.Environment env;

    private final DataSource dataSource;

    private final MultiTenantConnectionProviderImpl multiTenantConnectionProviderImpl;

    private final TenantIdentifierResolver tenantIdentifierResolver;

    @Bean
    JpaVendorAdapter jpaVendorAdapter() {
        return new HibernateJpaVendorAdapter();
    }

    @Bean
    @Primary
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {

        final LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);
        em.setPackagesToScan("online.meavalia.domain.entity");

        em.setJpaVendorAdapter(jpaVendorAdapter());

        final HashMap<String, Object> properties = new HashMap<>();
        properties.put(Environment.IMPLICIT_NAMING_STRATEGY, env.getProperty("spring.jpa.hibernate.naming.implicit-strategy"));
        properties.put(Environment.PHYSICAL_NAMING_STRATEGY, env.getProperty("spring.jpa.hibernate.naming.physical-strategy"));

//        https://github.com/hazelcast/hazelcast-hibernate5/issues/44
        properties.put(Environment.USE_SECOND_LEVEL_CACHE, env.getProperty("spring.jpa.properties.hibernate.cache.use_second_level_cache"));
        properties.put(Environment.USE_QUERY_CACHE, env.getProperty("spring.jpa.properties.hibernate.cache.use_query_cache"));
//        properties.put(Environment.CACHE_REGION_FACTORY, env.getProperty("spring.jpa.properties.hibernate.cache.region.factory_class"));
//        properties.put("hibernate.javax.cache.provider", env.getProperty("spring.jpa.properties.hibernate.javax.cache.provider"));

        // Seta a estrategia de criação de novo cacha durante a nova instância
        properties.put("hibernate.javax.cache.missing_cache_strategy", env.getProperty("spring.jpa.properties.hibernate.javax.cache.missing_cache_strategy"));

        properties.put(Environment.NON_CONTEXTUAL_LOB_CREATION, env.getProperty("spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation"));
        properties.put(Environment.USE_NEW_ID_GENERATOR_MAPPINGS, env.getProperty("spring.jpa.properties.hibernate.id.new_generator_mappings"));
        properties.put(Environment.SHOW_SQL, env.getProperty("spring.jpa.show-sql"));
        properties.put(Environment.FORMAT_SQL, env.getProperty("spring.jpa.format_sql"));
        properties.put(Environment.HBM2DDL_AUTO, env.getProperty("spring.jpa.hibernate.ddl-auto"));
        properties.put(Environment.DIALECT, env.getProperty("spring.jpa.properties.hibernate.dialect"));
        properties.put(Environment.DEFAULT_NULL_ORDERING, env.getProperty("spring.jpa.properties.hibernate.order_by.default_null_ordering"));
        properties.put(Environment.MULTI_TENANT, MultiTenancyStrategy.SCHEMA);
        properties.put(Environment.MULTI_TENANT_CONNECTION_PROVIDER, multiTenantConnectionProviderImpl);
        properties.put(Environment.MULTI_TENANT_IDENTIFIER_RESOLVER, tenantIdentifierResolver);

        // Envers
        properties.put("org.hibernate.envers.audit_table_suffix", env.getProperty("spring.jpa.properties.org.hibernate.envers.audit_table_suffix"));
        properties.put("org.hibernate.envers.revision_field_name", env.getProperty("spring.jpa.properties.org.hibernate.envers.revision_field_name"));
        properties.put("org.hibernate.envers.revision_type_field_name", env.getProperty("spring.jpa.properties.org.hibernate.envers.revision_type_field_name"));

        em.setJpaPropertyMap(properties);

        return em;
    }

    @Configuration
    @AllArgsConstructor
    public static class TransactionManager {

        private final LocalContainerEntityManagerFactoryBean localContainerEntityManagerFactoryBean;

        @Primary
        @Bean
        public PlatformTransactionManager transactionManager() {
            final JpaTransactionManager transactionManager = new JpaTransactionManager();
            transactionManager.setEntityManagerFactory(localContainerEntityManagerFactoryBean.getObject());
            return transactionManager;
        }

    }
}
