package br.com.ubest.application.hibernate;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import org.hibernate.EmptyInterceptor;
import org.hibernate.Session;
import org.hibernate.type.Type;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateSettings;
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

import javax.sql.DataSource;
import java.io.Serializable;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import br.com.ubest.application.multitenancy.MultiTenantConnectionProviderImpl;
import br.com.ubest.application.multitenancy.TenantIdentifierResolver;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.hibernate.EmptyInterceptor;
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

//    private final MultiTenantConnectionProviderImpl multiTenantConnectionProviderImpl;

    private final EmptyInterceptor emptyInterceptor;

    @Configuration
    @AllArgsConstructor
    public static class TransactionManager {

        private final LocalContainerEntityManagerFactoryBean localContainerEntityManagerFactoryBean;

        @Primary
        @Bean
        public PlatformTransactionManager transactionManager() throws SQLException {

            final JpaTransactionManager transactionManager = new JpaTransactionManager();
            transactionManager.setEntityManagerFactory(localContainerEntityManagerFactoryBean.getObject());
            return transactionManager;
        }

    }

    @Bean
    JpaVendorAdapter jpaVendorAdapter() {
        return new HibernateJpaVendorAdapter();
    }

    @Bean
    @Primary
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {

        final LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);
        em.setPackagesToScan("br.com.ubest.domain.entity");
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
//        properties.put(Environment.MULTI_TENANT, MultiTenancyStrategy.SCHEMA);
//        properties.put(Environment.MULTI_TENANT_CONNECTION_PROVIDER, multiTenantConnectionProviderImpl);
//        properties.put(Environment.MULTI_TENANT_IDENTIFIER_RESOLVER, tenantIdentifierResolver);

        // Envers
        properties.put("org.hibernate.envers.audit_table_suffix", env.getProperty("spring.jpa.properties.org.hibernate.envers.audit_table_suffix"));
        properties.put("org.hibernate.envers.revision_field_name", env.getProperty("spring.jpa.properties.org.hibernate.envers.revision_field_name"));
        properties.put("org.hibernate.envers.revision_type_field_name", env.getProperty("spring.jpa.properties.org.hibernate.envers.revision_type_field_name"));

        properties.put("hibernate.ejb.interceptor", emptyInterceptor);

        em.setJpaPropertyMap(properties);

        return em;
    }
//    private final Logger log = LoggerFactory.getLogger(this.getClass());

//    private final TenantIdentifierResolver tenantIdentifierResolver;

//    @Bean
//    public EmptyInterceptor hibernateInterceptor() {
//        return new EmptyInterceptor() {
//
//            @Override
//            public boolean onSave(Object entity, Serializable id, Object[] state, String[] propertyNames, Type[] types) {
//                if (entity instanceof AbstractEntity) {
//                    log.debug("[save] Updating the entity " + id + " with util information: " + tenantIdentifierResolver.resolveCurrentTenantIdentifier());
//                    ((AbstractEntity) entity).setTenant(tenantIdentifierResolver.resolveCurrentTenantIdentifier());
//                }
//                return false;
//            }
//
//            @Override
//            public void onDelete(Object entity, Serializable id, Object[] state, String[] propertyNames, Type[] types) {
//                if (entity instanceof AbstractEntity) {
//                    log.debug("[delete] Updating the entity " + id + " with util information: " + tenantIdentifierResolver.resolveCurrentTenantIdentifier());
//                    ((AbstractEntity) entity).setTenant(tenantIdentifierResolver.resolveCurrentTenantIdentifier());
//                }
//            }
//
//            @Override
//            public boolean onFlushDirty(Object entity, Serializable id, Object[] currentState, Object[] previousState, String[] propertyNames, Type[] types) {
//                if (entity instanceof AbstractEntity) {
//                    log.debug("[flush-dirty] Updating the entity " + id + " with util information: " + tenantIdentifierResolver.resolveCurrentTenantIdentifier());
//                    ((AbstractEntity) entity).setTenant(tenantIdentifierResolver.resolveCurrentTenantIdentifier());
//                }
//                return false;
//            }
//
//        };
//    }
}
