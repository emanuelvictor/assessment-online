package br.com.assessment.application.multitenancy;

import br.com.assessment.domain.entity.usuario.Usuario;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
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

public class TenantFilter implements HandlerFilterFunction<ServerResponse, ServerResponse> {

    @Override
    public Mono<ServerResponse> filter(ServerRequest serverRequest,
                                       HandlerFunction<ServerResponse> handlerFunction) {

        Mono<Principal> a = (Mono<Principal>) serverRequest.principal();
        return handlerFunction.handle(
                a.map(o -> {
                     o.getName();
                     return serverRequest;
                }).switchIfEmpty(serverRequest)
        );
    }
}

//@Component
//public class TenantFilter implements WebFilter {
//
//
//    /**
//     *
//     */
//    @Override
//    public Mono<Void> filter(ServerWebExchange serverWebExchange,
//                             WebFilterChain webFilterChain) {
////        serverWebExchange.getResponse()
////                .getHeaders().add("web-filter", "web-filter-test");
////        serverWebExchange.getPrincipal().map(principal -> principal.getName()).subscribe(s -> System.out.println(s));
////        TenantContext.setCurrentTenant(((Usuario) serverWebExchange.getPrincipal()..getContext().block().getAuthentication().getPrincipal()).getEmail());
//
//
////        return ReactiveSecurityContextHolder.getContext().map(securityContext ->  {
////            System.out.println(securityContext.getAuthentication().getPrincipal());
////            return webFilterChain.filter(serverWebExchange);
////        })
////                .flatMap(voidMono -> {
////                    return voidMono;
////                });
//        System.out.println(ReactiveSecurityContextHolder.getContext());
//
//
////        webFilterChain.filter(serverWebExchange).map(aVoid -> {
////          return ReactiveSecurityContextHolder.getContext();
////        }).flatMap(securityContextMono -> securityContextMono)
////        .map(securityContext -> {
////            return securityContext
////        }).map(securityContext -> Mono.empty());
//
//        ReactiveSecurityContextHolder.getContext()
//                .subscribe(securityContext -> {
//                    securityContext.getAuthentication();
//                });
//
//
//        return ReactiveSecurityContextHolder.getContext()
//                .map(a -> {
//                    System.out.println("aqui");
//                 return a.getAuthentication();
//                }).map(authentication -> {
//                    System.out.println(authentication.getPrincipal());
//                    TenantContext.setCurrentTenant(((Usuario)authentication.getPrincipal()).getTenant());
//                    return webFilterChain.filter(serverWebExchange);
//                }).flatMap(voidMono -> voidMono);
////                .switchIfEmpty(
////                        webFilterChain.filter(serverWebExchange)
////                );
//
//
////        return webFilterChain.filter(serverWebExchange);
//    }
////return Mono.zip( serverWebExchange.getPrincipal(), webFilterChain.filter(serverWebExchange))
////        .map(pair -> {
////            TenantContext.setCurrentTenant(((Usuario) pair.getT1()).getEmail());
////            return pair.getT2();
////        });
//
////        return webFilterChain.filter(serverWebExchange);
////    }
//
//}
