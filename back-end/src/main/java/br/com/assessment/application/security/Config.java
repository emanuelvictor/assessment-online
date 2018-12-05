package br.com.assessment.application.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabase;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;
import org.springframework.session.jdbc.config.annotation.web.http.EnableJdbcHttpSession;
import org.springframework.session.web.context.AbstractHttpSessionApplicationInitializer;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;


//@Configuration
//@EnableJdbcHttpSession
public class Config
//        extends AbstractHttpSessionApplicationInitializer
{
//    private final DataSource dataSource;
//
//    public Config(final DataSource dataSource) {
//        super(Config.class);
//        this.dataSource = dataSource;
//    }
//    //    }
//    //                .addScript("org/springframework/session/jdbc/schema-h2.sql").build();
//    //                .setType(EmbeddedDatabaseType.H2)
//    //        return new EmbeddedDatabaseBuilder()
//    //    public EmbeddedDatabase dataSource() {
////    @Bean
//
//
//
//    @Bean
//    public PlatformTransactionManager transactionManager(/*DataSource dataSource*/) {
//        return new DataSourceTransactionManager(dataSource);
//    }
}
