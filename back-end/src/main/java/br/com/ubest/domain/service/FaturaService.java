package br.com.ubest.domain.service;

import br.com.ubest.domain.repository.FaturaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FaturaService {

    /**
     *
     */
    private final FaturaRepository faturaRepository ;

}
