package online.meavalia.domain.repository;

import online.meavalia.domain.entity.avaliacao.Agrupador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AgrupadorRepository extends JpaRepository<Agrupador, Long> {

    @Query("FROM Agrupador agrupador WHERE (agrupador.ativo = false)")
    List<Agrupador> listAllInativos();
}
