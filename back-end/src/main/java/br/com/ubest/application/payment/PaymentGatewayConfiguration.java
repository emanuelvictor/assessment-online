package br.com.ubest.application.payment;

//import br.com.moip.API;
//import br.com.moip.Client;
//import br.com.moip.authentication.Authentication;
//import br.com.moip.authentication.BasicAuth;
//import br.com.moip.authentication.OAuth;

import br.com.moip.auth.Authentication;
import br.com.moip.auth.BasicAuth;
import br.com.moip.auth.OAuth;
import br.com.moip.models.Setup;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//import org.springframework.context.annotation.Bean;

/**
 * Created by emanuel on 24/07/17.
 */
@Data
@Configuration
public class PaymentGatewayConfiguration {
    /**
     *
     */
    @Value("${gateway-payment.key}")
    private String key;

    /**
     *
     */
    @Value("${gateway-payment.token}")
    private String token;

    /**
     *
     */
    @Value("${gateway-payment.access-token}")
    private String accessToken;

    /**
     *
     */
    @Value("${gateway-payment.environment}")
    private String environment;

    /**
     *
     */
    @Value("${gateway-payment.public-key}")
    private String publicKey;

//    /**
//     * @return
//     */
//    @Bean
//    public Moip.API getApi() {
////        return new Moip.API(this.basicClient());
//    }

    /**
     * @return
     */
    @Bean
    public Setup getSetup() {
        final Authentication auth = this.getAccessTokenAuthentication();

        return getSetup(auth, environment);
    }

    /**
     * @return
     */
    private Setup basicSetup() {
        final Authentication auth = new BasicAuth(token, key);

        return getSetup(auth, environment);
    }

    /**
     *
     * @param auth
     * @param environment
     * @return
     */
    private static Setup getSetup(final Authentication auth, final String environment) {
        if (environment.compareTo("PRODUCTION") == 0) {
            return new Setup().setAuthentication(auth).setEnvironment(Setup.Environment.PRODUCTION);
        } else {
            return new Setup().setAuthentication(auth).setEnvironment(Setup.Environment.SANDBOX);
        }
    }


    /**
     * @return
     */
    @Bean
    public Authentication getAccessTokenAuthentication() {
        //Access Token exclusivo para criação de contas
        return new OAuth(this.accessToken);
    }
}
