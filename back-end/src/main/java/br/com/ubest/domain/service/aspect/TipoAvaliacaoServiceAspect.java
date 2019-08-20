package br.com.ubest.domain.service.aspect;

import br.com.ubest.domain.service.TipoAvaliacaoService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.hibernate.Session;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class TipoAvaliacaoServiceAspect {

    // only applicable to employee service
    @Before("execution(* br.com.ubest.domain.service.TipoAvaliacaoService.*(..)) && target(tipoAvaliacaoService)")
    @Pointcut("@target(org.springframework.transaction.annotation.Transactional)")
    public void aroundExecution(JoinPoint pjp, TipoAvaliacaoService tipoAvaliacaoService) {
        final org.hibernate.Filter filter = tipoAvaliacaoService.entityManager.unwrap(Session.class).enableFilter("tenantFilter");
        filter.setParameter("tenant", tipoAvaliacaoService.tenantIdentifierResolver.resolveCurrentTenantIdentifier());
        filter.validate();
    }
}
