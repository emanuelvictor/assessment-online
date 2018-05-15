package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.unidade.Unidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

public interface UnidadeRepository
        extends JpaRepository<Unidade, Long>
{

}
