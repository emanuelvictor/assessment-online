package br.com.assessment.application.multitenancy;

import br.com.assessment.domain.entity.usuario.Usuario;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.HandlerFilterFunction;
import org.springframework.web.reactive.function.server.HandlerFunction;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.security.Principal;

import static org.springframework.http.HttpStatus.FORBIDDEN;

//public class TenantFilter implements HandlerFilterFunction<ServerResponse, ServerResponse> {
//
//    @Override
//    public Mono<ServerResponse> filter(ServerRequest serverRequest,
//                                       HandlerFunction<ServerResponse> handlerFunction) {
//
////        Mono<Principal> a = (Mono<Principal>) serverRequest.principal();
//
//        Mono<ServerResponse> teste = ReactiveSecurityContextHolder.getContext()
//                .switchIfEmpty(handlerFunction.handle(serverRequest))
//                .flatMap(securityContext -> securityContext).flatMap(r -> );
//
//        Mono<SecurityContext> vazio = ReactiveSecurityContextHolder.getContext().switchIfEmpty(Mono.just(null));
//
//        return handlerFunction.handle(serverRequest).flatMap(serverResponse -> teste);
//    }
//}

@Component
public class TenantFilter implements WebFilter {


    /**
     *
     */
    @Override
    public Mono<Void> filter(ServerWebExchange serverWebExchange,
                             WebFilterChain webFilterChain) {
//        serverWebExchange.getResponse()
//                .getHeaders().add("web-filter", "web-filter-test");
//        serverWebExchange.getPrincipal().map(principal -> principal.getName()).subscribe(s -> System.out.println(s));
//        TenantContext.setCurrentTenant(((Usuario) serverWebExchange.getPrincipal()..getContext().block().getAuthentication().getPrincipal()).getEmail());


//        return ReactiveSecurityContextHolder.getContext().map(securityContext ->  {
//            System.out.println(securityContext.getAuthentication().getPrincipal());
//            return webFilterChain.filter(serverWebExchange);
//        })
//                .flatMap(voidMono -> {
//                    return voidMono;
//                });
//        System.out.println(ReactiveSecurityContextHolder.getContext().map(securityContext -> securityContext.getAuthentication()).map(authentication -> authentication));


//        webFilterChain.filter(serverWebExchange).map(aVoid -> {
//          return ReactiveSecurityContextHolder.getContext();
//        }).flatMap(securityContextMono -> securityContextMono)
//        .map(securityContext -> {
//            return securityContext
//        }).map(securityContext -> Mono.empty());


        return ReactiveSecurityContextHolder.getContext()
                .switchIfEmpty(
                        webFilterChain.filter(serverWebExchange).flatMap(aVoid -> {
                            System.out.println("está vazio");
                            return Mono.empty();
                        })
                )
                .map(a -> {
                    if (a.getAuthentication() != null) {
                        System.out.println(a.getAuthentication().getPrincipal());
                        TenantContext.setCurrentTenant(((Usuario) a.getAuthentication().getPrincipal()).getTenant());
                    }
                    return webFilterChain.filter(serverWebExchange);
                })
                .map(authentication -> webFilterChain.filter(serverWebExchange)).flatMap(voidMono -> voidMono);


//    }
//return Mono.zip( ReactiveSecurityContextHolder.getContext().switchIfEmpty(Mono.just(new SecurityContextImpl())), webFilterChain.filter(serverWebExchange))
//        .map(pair -> {
//            TenantContext.setCurrentTenant(((Usuario) pair.getT1()).getEmail());
//            return pair.getT2();
//        });

//        return webFilterChain.filter(serverWebExchange);
    }

}
