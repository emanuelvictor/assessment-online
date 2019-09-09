package br.com.ubest.application.payment;

//import br.com.moip.API;
//import br.com.moip.Client;
//import br.com.moip.authentication.Authentication;
//import br.com.moip.authentication.BasicAuth;
//import br.com.moip.authentication.OAuth;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Created by emanuel on 24/07/17.
 */
@Data
@Configuration
public class PaymentGatewayConfiguration
{
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

//	/**
//	 *
//	 * @return
//	 */
//	@Bean
//	public API getApi()
//	{
//		return new API( this.basicClient());
//	}
//
//	/**
//	 *
//	 * @return
//	 */
//	@Bean
//	public Client getClient()
//	{
//		final Authentication auth = this.getAccessTokenAuthentication();
//
//		final Client client;
//
//		if ( environment.compareTo( "PRODUCTION" ) == 0 )
//		{
//			client = new Client( Client.PRODUCTION, auth );
//		}
//		else
//		{
//			client = new Client( Client.SANDBOX, auth );
//		}
//		return client;
//	}
//
//	/**
//	 *
//	 * @return
//	 */
//	private Client basicClient()
//	{
//		final Authentication auth = new BasicAuth( token, key );
//
//		final Client client;
//
//		if ( environment.compareTo( "PRODUCTION" ) == 0 )
//		{
//			client = new Client( Client.PRODUCTION, auth );
//		}
//		else
//		{
//			client = new Client( Client.SANDBOX, auth );
//		}
//		return client;
//	}
//
//
//	/**
//	 *
//	 * @return
//	 */
//	@Bean
//	public Authentication getAccessTokenAuthentication()
//	{
//		//Access Token exclusivo para criação de contas
//		return new OAuth( this.accessToken );
//	}
}
