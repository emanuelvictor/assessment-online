package online.meavalia.domain;

import lombok.RequiredArgsConstructor;
import online.meavalia.application.tenant.TenantIdentifierResolver;
import online.meavalia.domain.entity.assinatura.Cupom;
import online.meavalia.domain.repository.CupomRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CupomService {

    /**
     *
     */
    private final CupomRepository cupomRepository;

    /**
     *
     */
    private final TenantIdentifierResolver tenantIdentifierResolver;

    /**
     * @param defaultFilter
     * @param pageable
     * @return
     */
    @Transactional(readOnly = true)
    public Page<Cupom> listByFilters(final String defaultFilter, final Pageable pageable) {
        return this.cupomRepository.listByFilters(defaultFilter, pageable);
    }

    /**
     * @param id
     */
    @Transactional
    public void delete(final long id) {
        this.cupomRepository.deleteById(id);
    }

    /**
     * @param cupom
     * @return
     */
    @Transactional
    public Cupom save(final Cupom cupom) {
        return this.cupomRepository.save(cupom);
    }

    /**
     * @param id Long
     * @return Optional<Cupom>
     */
    @Transactional(readOnly = true)
    public Optional<Cupom> findById(final long id) {
        return this.cupomRepository.findById(id);
    }

    /**
     *
     * @param tenant
     * @return
     */
    @Transactional(readOnly = true)
    public Cupom findByTenant(final String tenant){
        return this.cupomRepository.findByTenant(tenant);
    }

    /**
     * @return Cupom
     */
    @Transactional(readOnly = true)
    public Cupom getCupomByCurrentTenant() {
        return this.findByTenant(tenantIdentifierResolver.resolveCurrentTenantIdentifier());
    }
}
