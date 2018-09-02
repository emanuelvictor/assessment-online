package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.avaliacao.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

}
