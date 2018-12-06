package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.usuario.Sessao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessaoRepository extends JpaRepository<Sessao, Long> {

    Sessao findByToken(final String token);

}
