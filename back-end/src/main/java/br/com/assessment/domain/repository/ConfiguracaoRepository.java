package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.configuracao.Configuracao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfiguracaoRepository extends JpaRepository<Configuracao, Long> {

}
