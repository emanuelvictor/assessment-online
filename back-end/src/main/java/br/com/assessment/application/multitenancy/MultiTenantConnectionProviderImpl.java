package br.com.assessment.application.multitenancy;


import lombok.AllArgsConstructor;
import org.hibernate.HibernateException;
import org.hibernate.engine.jdbc.connections.spi.MultiTenantConnectionProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

import static br.com.assessment.application.multitenancy.TenantIdentifierResolver.DEFAULT_TENANT_ID;

@Component
@AllArgsConstructor
public class MultiTenantConnectionProviderImpl implements MultiTenantConnectionProvider {

//    @ConfigurationProperties
//    public DataSourceProperties dataSourceProperties() {
//        return new DataSourceProperties();
//    }
//
//    public HikariDataSource dataSource() {
//
//        return this.dataSourceProperties().initializeDataSourceBuilder().type(HikariDataSource.class)
//                .build();
//    }

    private final DataSource dataSource;

    @Override
    public Connection getAnyConnection() throws SQLException {
//        if (this.dataSource != null)
            return this.dataSource.getConnection();
//        return dataSource().getConnection();
    }

    @Override
    public void releaseAnyConnection(Connection connection) throws SQLException {
        connection.close();
    }

    @Override
    public Connection getConnection(final String tenantIdentifier) throws SQLException {
        System.out.println("Tenant " + tenantIdentifier);
        final Connection connection = getAnyConnection();
        try {
            if (tenantIdentifier != null) {
                connection.createStatement().execute("SET SCHEMA '" + tenantIdentifier+ "'");
            } else {
                connection.createStatement().execute("SET SCHEMA '" + DEFAULT_TENANT_ID + "'");
            }
        }
        catch ( SQLException e ) {
            throw new HibernateException(
                    "Problem setting schema to " + tenantIdentifier,
                    e
            );
        }
        return connection;
    }

    @Override
    public void releaseConnection(String tenantIdentifier, Connection connection) throws SQLException {
        try {
            connection.createStatement().execute( "SET SCHEMA '" + DEFAULT_TENANT_ID + "'");
        }
        catch ( SQLException e ) {
            throw new HibernateException(
                    "Problem setting schema to " + tenantIdentifier,
                    e
            );
        }
        connection.close();
    }
    @SuppressWarnings("rawtypes")
    @Override
    public boolean isUnwrappableAs(Class unwrapType) {
        return false;
    }
    @Override
    public <T> T unwrap(Class<T> unwrapType) {
        return null;
    }
    @Override
    public boolean supportsAggressiveRelease() {
        return true;
    }
}

