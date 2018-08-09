package br.com.assessment.application.multitenancy;


import lombok.AllArgsConstructor;
import org.hibernate.HibernateException;
import org.hibernate.engine.jdbc.connections.spi.MultiTenantConnectionProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

import static br.com.assessment.application.multitenancy.TenantIdentifierResolver.DEFAULT_TENANT_ID;

@Component
@AllArgsConstructor
public class MultiTenantConnectionProviderImpl implements MultiTenantConnectionProvider {
    private static Logger LOGGER = LoggerFactory.getLogger(MultiTenantConnectionProvider.class.getName());

    private final DataSource dataSource;

    @Override
    public Connection getAnyConnection() throws SQLException {
            return this.dataSource.getConnection();
    }

    @Override
    public void releaseAnyConnection(Connection connection) throws SQLException {
        connection.close();
    }

    @Override
    public Connection getConnection(final String tenantIdentifier) throws SQLException {
        LOGGER.info("Conta " + tenantIdentifier);
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

