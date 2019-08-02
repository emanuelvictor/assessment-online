package br.com.ubest.domain.service.aspect;

import br.com.ubest.domain.service.TipoAvaliacaoService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.hibernate.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class TipoAvaliacaoServiceAspect {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    // only applicable to employee service
    @Before("execution(* br.com.ubest.domain.service.TipoAvaliacaoService.*(..)) && target(tipoAvaliacaoService)")
    public void aroundExecution(JoinPoint pjp, TipoAvaliacaoService tipoAvaliacaoService) throws Throwable {
        org.hibernate.Filter filter = tipoAvaliacaoService.entityManager.unwrap(Session.class).enableFilter("tenantFilter");
        filter.setParameter("tenant", tipoAvaliacaoService.tenantIdentifierResolver.resolveCurrentTenantIdentifier());
        filter.validate();
    }
}
