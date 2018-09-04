package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.avaliacao.AvaliacaoColaborador;
import org.springframework.data.jpa.repository.JpaRepository;

// todo REMOVER e DELETAR depois que aprender a fazer funcionar o cascade
public interface AvaliacaoColaboradorRepository extends JpaRepository<AvaliacaoColaborador, Long> {

}
