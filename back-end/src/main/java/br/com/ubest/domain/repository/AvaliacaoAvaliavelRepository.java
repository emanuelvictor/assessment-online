package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.avaliacao.AvaliacaoAvaliavel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AvaliacaoAvaliavelRepository extends JpaRepository<AvaliacaoAvaliavel, Long> {

    /**
     * @param avaliacaoId long
     * @return List<AvaliacaoAvaliavel>
     */
    @Query("SELECT new AvaliacaoAvaliavel( avaliacaoAvaliavel.id, avaliacaoAvaliavel.avaliavel.usuario.nome ) FROM AvaliacaoAvaliavel avaliacaoAvaliavel WHERE avaliacaoAvaliavel.avaliacao.id = :avaliacaoId")
    List<AvaliacaoAvaliavel> listAvaliacaoAvaliavelByAvaliacaoId(@Param("avaliacaoId") final long avaliacaoId);

    /**
     * @param unidadeId long
     * @return List<AvaliacaoAvaliavel>
     */
    @Query("FROM AvaliacaoAvaliavel avaliacaoAvaliavel WHERE avaliacaoAvaliavel.avaliavel.unidadeTipoAvaliacao.unidade.id = :unidadeId")
    List<AvaliacaoAvaliavel> listAvaliacaoAvaliavelByUnidadeId(@Param("unidadeId") final long unidadeId);

    /**
     * @param usuarioId long
     * @return List<AvaliacaoAvaliavel>
     */
    @Query("FROM AvaliacaoAvaliavel avaliacaoAvaliavel WHERE avaliacaoAvaliavel.avaliavel.usuario.id = :usuarioId")
    List<AvaliacaoAvaliavel> listAvaliacaoAvaliavelByUsuarioId(@Param("usuarioId") final long usuarioId);

    /**
     * @param avaliavelId long
     * @return List<AvaliacaoAvaliavel>
     */
    List<AvaliacaoAvaliavel> findAllByAvaliavelId(@Param("avaliavelId") final long avaliavelId);

}
