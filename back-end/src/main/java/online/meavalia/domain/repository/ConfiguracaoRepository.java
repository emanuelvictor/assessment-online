package online.meavalia.domain.repository;

import online.meavalia.domain.entity.configuracao.Configuracao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfiguracaoRepository extends JpaRepository<Configuracao, Long> {

}
