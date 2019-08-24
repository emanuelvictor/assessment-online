package br.com.ubest.domain.service;

import br.com.ubest.application.multitenancy.TenantIdentifierResolver;
import br.com.ubest.domain.entity.unidade.Dispositivo;
import br.com.ubest.domain.entity.unidade.Unidade;
import br.com.ubest.domain.entity.usuario.Conta;
import br.com.ubest.domain.repository.ContaRepository;
import br.com.ubest.domain.repository.DispositivoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DispositivoService {

    private final ContaRepository contaRepository;

    private final DispositivoRepository dispositivoRepository;

    private final TenantIdentifierResolver tenantIdentifierResolver;

    /**
     * @param defaultFilter     String
     * @param enderecoFilter    String
     * @param dataInicioFilter  String
     * @param dataTerminoFilter String
     * @param pageable          pageable
     * @return Page<Unidade>
     */
    public Page<Dispositivo> listByFilters(final String defaultFilter, final Boolean withBondFilter, final Boolean withAvaliaveisFilter, final Boolean withUnidadesTiposAvaliacoesAtivasFilter, final List<Long> idsFilter, final Pageable pageable) {

        final Conta conta = contaRepository.findByEmailIgnoreCase(tenantIdentifierResolver.getUsername());

        final Long usuarioId = conta.isRoot() ? null : conta.getUsuario().getId();

        return this.dispositivoRepository.findAll(new PageRequest(0, 20));

    }

}
