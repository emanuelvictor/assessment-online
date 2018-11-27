package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.avaliacao.AvaliacaoColaborador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AvaliacaoColaboradorRepository extends JpaRepository<AvaliacaoColaborador, Long> {

    /**
     * @param avaliacaoId long
     * @return List<AvaliacaoColaborador>
     */
    @Query("SELECT new AvaliacaoColaborador( avaliacaoColaborador.id, avaliacaoColaborador.colaborador.usuario.nome ) FROM AvaliacaoColaborador avaliacaoColaborador WHERE avaliacaoColaborador.avaliacao.id = :avaliacaoId")
    List<AvaliacaoColaborador> listAvaliacaoColaboradorByAvaliacaoId(@Param("avaliacaoId") final long avaliacaoId);

    /**
     * @param unidadeId long
     * @return List<AvaliacaoColaborador>
     */
    @Query("FROM AvaliacaoColaborador avaliacaoColaborador WHERE avaliacaoColaborador.colaborador.unidade.id = :unidadeId")
    List<AvaliacaoColaborador> listAvaliacaoColaboradorByUnidadeId(@Param("unidadeId") final long unidadeId);

    /**
     * @param usuarioId long
     * @return List<AvaliacaoColaborador>
     */
    @Query("FROM AvaliacaoColaborador avaliacaoColaborador WHERE avaliacaoColaborador.colaborador.usuario.id = :usuarioId")
    List<AvaliacaoColaborador> listAvaliacaoColaboradorByUsuarioId(@Param("usuarioId") final long usuarioId);

}
