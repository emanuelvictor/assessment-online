package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.usuario.Sessao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

public interface SessaoRepository extends JpaRepository<Sessao, String> {

}
