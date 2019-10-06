package br.com.ubest.domain.service;

import br.com.ubest.domain.entity.assinatura.Cupom;
import br.com.ubest.domain.repository.ContaRepository;
import br.com.ubest.domain.repository.CupomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CupomService {

    /**
     *
     */
    private final CupomRepository cupomRepository;

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
     *
     * @param id
     */
    @Transactional
    public void delete(final long id) {
        this.cupomRepository.deleteById(id);
    }

    /**
     *
     * @param cupom
     * @return
     */
    @Transactional
    public Cupom save(final Cupom cupom) {
        return this.cupomRepository.save(cupom);
    }
}
