package br.com.assessment.application.filters;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.security.web.server.authentication.logout.LogoutWebFilter;
import org.springframework.security.web.server.authentication.logout.RedirectServerLogoutSuccessHandler;
import org.springframework.security.web.server.authentication.logout.SecurityContextServerLogoutHandler;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers;

import java.net.URI;

//@Configuration
public class SecurityFilters {

//    @Bean
//    public AuthenticationWebFilter authenticationWebFilter() {
//        AuthenticationWebFilter filter = new AuthenticationWebFilter(authenticationManager());
//
//        filter.setSecurityContextRepository(securityContextRepository());
//        filter.setAuthenticationConverter(jsonBodyAuthenticationConverter());
//        filter.setAuthenticationSuccessHandler(this.authenticationSuccessHandler);
//        filter.setAuthenticationFailureHandler(authenticationFailureHandler);
//        filter.setRequiresAuthenticationMatcher(
//                ServerWebExchangeMatchers.pathMatchers(HttpMethod.POST, "/login")
//        );
//
//        return filter;
//    }
//
//    public LogoutWebFilter logoutWebFilter() {
//        LogoutWebFilter logoutWebFilter = new LogoutWebFilter();
//
//        SecurityContextServerLogoutHandler logoutHandler = new SecurityContextServerLogoutHandler();
//        logoutHandler.setSecurityContextRepository(securityContextRepository());
//
//        RedirectServerLogoutSuccessHandler logoutSuccessHandler = new RedirectServerLogoutSuccessHandler();
//        logoutSuccessHandler.setLogoutSuccessUrl(URI.create("/"));
//
//        logoutWebFilter.setLogoutHandler(logoutHandler);
//        logoutWebFilter.setLogoutSuccessHandler(logoutSuccessHandler);
//        logoutWebFilter.setRequiresLogoutMatcher(
//                ServerWebExchangeMatchers.pathMatchers(HttpMethod.GET, "/logout")
//        );
//
//        return logoutWebFilter;
//    }
}
