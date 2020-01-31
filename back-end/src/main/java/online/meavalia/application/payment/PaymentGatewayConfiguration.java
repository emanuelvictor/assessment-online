package online.meavalia.application.payment;

import br.com.moip.auth.Authentication;
import br.com.moip.auth.OAuth;
import br.com.moip.models.Setup;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Created by emanuel on 24/07/17.
 */
@Configuration
public class PaymentGatewayConfiguration {

    /**
     *
     */
    @Getter
    @Value("${gateway-payment.key}")
    private String key;

    /**
     *
     */
    @Getter
    @Value("${gateway-payment.token}")
    private String token;

    /**
     *
     */
    @Getter
    @Value("${gateway-payment.access-token}")
    private String accessToken;

    /**
     *
     */
    @Getter
    @Value("${gateway-payment.environment}")
    private String environment;

    /**
     *
     */
    @Getter
    @Value("${gateway-payment.public-key}")
    private String publicKey;

    /**
     *
     */
    @Getter
    @Value("${gateway-payment.logo-uri}")
    private String logoUri;

    /**
     * @return
     */
    @Bean
    public Setup getSetup() {
        final Authentication auth = this.getAccessTokenAuthentication();
        return getSetup(auth, environment);
    }

    /**
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
