package br.com.ubest.application.multitenancy;


import lombok.AllArgsConstructor;
import org.hibernate.HibernateException;
import org.hibernate.engine.jdbc.connections.spi.MultiTenantConnectionProvider;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

import static br.com.ubest.application.context.LocalContext.DEFAULT_TENANT_ID;


@Component
@AllArgsConstructor
public class MultiTenantConnectionProviderImpl implements MultiTenantConnectionProvider {
//    private static Logger logger = LoggerFactory.getLogger(MultiTenantConnectionProvider.class.getName());

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
//        logger.info("Get connection for tenant {}", tenantIdentifier);
        final Connection connection = getAnyConnection();
        try {
            if (tenantIdentifier != null) {
                connection.setSchema(tenantIdentifier);
            } else {
                connection.setSchema(DEFAULT_TENANT_ID);
            }
        } catch (SQLException e) {
            throw new HibernateException(
                    "Problem setting schema to " + tenantIdentifier,
                    e
            );
        }
        return connection;
    }

    @Override
    public void releaseConnection(String tenantIdentifier, Connection connection) throws SQLException {
//        logger.info("Release connection for tenant {}", tenantIdentifier);
        connection.setSchema(DEFAULT_TENANT_ID);
        releaseAnyConnection(connection);
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

