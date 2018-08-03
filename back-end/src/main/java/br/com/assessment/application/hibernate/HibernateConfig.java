package br.com.assessment.application.hibernate;

import br.com.assessment.application.multitenancy.MultiTenantConnectionProviderImpl;
import br.com.assessment.application.multitenancy.TenantIdentifierResolver;
import com.zaxxer.hikari.HikariDataSource;
import lombok.AllArgsConstructor;
import org.hibernate.MultiTenancyStrategy;
import org.hibernate.cfg.Environment;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.hibernate.engine.jdbc.connections.spi.MultiTenantConnectionProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.couchbase.CouchbaseProperties;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateSettings;
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.annotation.Order;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.transaction.PlatformTransactionManager;

import javax.persistence.EntityManager;
import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import javax.sql.DataSource;

////@Configuration
//public class HibernateConfig
//{
////    @Autowired
//    private JpaProperties jpaProperties;
//
//
////    @Bean
//    public JpaVendorAdapter jpaVendorAdapter() {
//        return new HibernateJpaVendorAdapter();
//    }
//
////    @Bean
//    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource,
//                                                                       MultiTenantConnectionProvider multiTenantConnectionProviderImpl,
//                                                                       CurrentTenantIdentifierResolver currentTenantIdentifierResolverImpl) {
//
////        HibernateSettings settings =  new HibernateSettings().hibernatePropertiesCustomizers(Collection< HibernatePropertiesCustomizer > hibernatePropertiesCustomizers);
////        settings.ddlAuto("create-drop");
//
//
//        final Map<String, Object> properties = new HashMap<>();
//        properties.put("properties",jpaProperties.getProperties());
//properties.put(Environment.SHOW_SQL, true);
//        properties.put(Environment.MULTI_TENANT, MultiTenancyStrategy.SCHEMA);
//                properties.put(Environment.MULTI_TENANT_CONNECTION_PROVIDER, multiTenantConnectionProviderImpl);
//                properties.put(Environment.MULTI_TENANT_IDENTIFIER_RESOLVER, currentTenantIdentifierResolverImpl);
//        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
//        em.setDataSource(dataSource);
//        em.setPackagesToScan("br.com.assessment");
//        em.setJpaVendorAdapter(jpaVendorAdapter());
//        em.setJpaPropertyMap(properties);
//        return em;
//    }
//
////    @Bean
////    public LocalContainerEntityManagerFactoryBean entityManagerFactory(EntityManagerFactoryBuilder factory, DataSource dataSource, JpaProperties properties) {
////        HibernateSettings settings = new HibernateSettings();
////        settings.ddlAuto("create-drop");
////        Map<String, Object> jpaProperties = new HashMap<>(properties.getHibernateProperties(settings));
//////        jpaProperties.put("hibernate.ejb.interceptor", hibernateInterceptor());
////        return factory.dataSource(dataSource).packages("br.com.assessment").properties(jpaProperties).build();
////    }
//
//    HibernateSettings hibernateProperties() {
//        return new HibernateSettings() {
//            {
////                setProperty("hibernate.hbm2ddl.auto",
////                        env.getProperty("hibernate.hbm2ddl.auto"));
////                setProperty("hibernate.dialect",
////                        env.getProperty("hibernate.dialect"));
////                setProperty("hibernate.globally_quoted_identifiers",
////                        "true");
//            }
//        };
//    }
//
//}


@Configuration
//@PropertySource({ "classpath:persistence-multiple-db.properties" })
//@EnableJpaRepositories(
//        basePackages = "org.baeldung.persistence.multiple.dao.user",
//        entityManagerFactoryRef = "userEntityManager",
//        transactionManagerRef = "userTransactionManager"
//)
@AllArgsConstructor
public class HibernateConfig {

    private final DataSource dataSource;

    private final org.springframework.core.env.Environment env;

    private final MultiTenantConnectionProviderImpl multiTenantConnectionProviderImpl;

    private final TenantIdentifierResolver tenantIdentifierResolver;

    @Bean
    @Primary
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        final LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);
        em.setPackagesToScan("br.com.assessment.domain.entity");

        final HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(vendorAdapter);

        final HashMap<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", env.getProperty("spring.jpa.hibernate.ddl-auto"));
        properties.put("hibernate.dialect", env.getProperty("spring.jpa.properties.hibernate.dialect"));
        properties.put(Environment.MULTI_TENANT, MultiTenancyStrategy.SCHEMA);
        properties.put(Environment.MULTI_TENANT_CONNECTION_PROVIDER, multiTenantConnectionProviderImpl);
        properties.put(Environment.MULTI_TENANT_IDENTIFIER_RESOLVER, tenantIdentifierResolver);
        em.setJpaPropertyMap(properties);

        return em;
    }

    @Primary
    @Bean
    public PlatformTransactionManager transactionManager() {
        final JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(entityManagerFactory().getObject());
        return transactionManager;
    }
}
