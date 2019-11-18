package online.meavalia.infrastructure.hibernate.dialect;

import online.meavalia.infrastructure.hibernate.functions.PostgreSQLFilterFunction;
import org.hibernate.dialect.PostgreSQL9Dialect;

/**
 * @author emanuel.fonseca
 */
public class PostgreSQLDialect extends PostgreSQL9Dialect {
    /**
     *
     */
    public PostgreSQLDialect() {
        super.registerFunction("FILTER", new PostgreSQLFilterFunction());
    }
}
