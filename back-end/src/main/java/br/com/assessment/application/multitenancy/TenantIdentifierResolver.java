package br.com.assessment.application.multitenancy;


import br.com.assessment.application.context.LocalContext;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.stereotype.Component;

@Component
public class TenantIdentifierResolver implements CurrentTenantIdentifierResolver {


    @Override
    public String resolveCurrentTenantIdentifier() {
        return LocalContext.getCurrentSchema();
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }
}
