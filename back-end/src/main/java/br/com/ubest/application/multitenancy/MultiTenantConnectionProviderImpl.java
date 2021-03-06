package br.com.ubest.application.multitenancy;


import lombok.RequiredArgsConstructor;
import org.hibernate.HibernateException;
import org.hibernate.engine.jdbc.connections.spi.MultiTenantConnectionProvider;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

import static br.com.ubest.Application.DEFAULT_TENANT_ID;


@Component
@RequiredArgsConstructor
public class MultiTenantConnectionProviderImpl implements MultiTenantConnectionProvider {

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
        final Connection connection = getAnyConnection();
        try {
            if (tenantIdentifier != null) {
                connection.setSchema(tenantIdentifier);
            } else {
                connection.setSchema(DEFAULT_TENANT_ID);
            }
        } catch (SQLException e) {
            throw new HibernateException("Problem setting schema to " + tenantIdentifier, e);
        }
        return connection;
    }

    @Override
    public void releaseConnection(String tenantIdentifier, Connection connection) throws SQLException {
        connection.setSchema(DEFAULT_TENANT_ID);
        releaseAnyConnection(connection);
    }

    @Override
    @SuppressWarnings("rawtypes")
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

