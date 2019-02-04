package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.usuario.Sessao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessaoRepository extends JpaRepository<Sessao, Long> {

    Sessao findByToken(final String token);

}
