package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.configuracao.Configuracao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfiguracaoRepository extends JpaRepository<Configuracao, Long> {

}
