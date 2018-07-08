package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.colaborador.Colaborador;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ColaboradorRepository extends JpaRepository<Colaborador, Long> {

}
