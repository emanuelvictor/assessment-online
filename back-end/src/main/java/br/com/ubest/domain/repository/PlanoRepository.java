package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.assinatura.Plano;
import br.com.ubest.domain.entity.avaliacao.TipoAvaliacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PlanoRepository extends JpaRepository<Plano, Long> {

}
