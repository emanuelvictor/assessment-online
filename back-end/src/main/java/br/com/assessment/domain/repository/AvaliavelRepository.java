package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.usuario.vinculo.Avaliavel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AvaliavelRepository extends JpaRepository<Avaliavel, Long> {

    @Query(
            " SELECT avaliavel FROM Avaliavel avaliavel WHERE" +
                    "(" +
                    "   (" +
                    "       (:unidadeId IS NULL AND (:usuarioId IS NOT NULL AND avaliavel.usuario.id = :usuarioId)) " +
                    "       OR " +
                    "       (:usuarioId IS NULL AND (:unidadeId IS NOT NULL AND avaliavel.unidadeTipoAvaliacao.unidade.id = :unidadeId))" +
                    "       OR :usuarioId IS NULL AND :unidadeId IS NULL " +
                    "   )" +
                    "   AND " +
                    "   (" +
                    "       (:unidadeTipoAvaliacaoId IS NOT NULL AND avaliavel.unidadeTipoAvaliacao.id = :unidadeTipoAvaliacaoId)" +
                    "       OR :unidadeTipoAvaliacaoId IS NULL  " +
                    "   )" +
                    "   AND (" +
                    "           FILTER(:defaultFilter, avaliavel.unidadeTipoAvaliacao.unidade.nome) = TRUE" +
                    "       OR " +
                    "           (" +
                    "               FILTER(:defaultFilter, avaliavel.unidadeTipoAvaliacao.tipoAvaliacao.nome, avaliavel.unidadeTipoAvaliacao.tipoAvaliacao.selecao, avaliavel.unidadeTipoAvaliacao.tipoAvaliacao.enunciado) = TRUE" +
                    "           )" +
                    "       )" +
                    ")"
    )
    Page<Avaliavel> listByFilters(@Param("defaultFilter") final String defaultFilter,
                                  @Param("usuarioId") final Long usuarioId,
                                  @Param("unidadeId") final Long unidadeId,
                                  @Param("unidadeTipoAvaliacaoId") final Long unidadeTipoAvaliacaoId,
                                  final Pageable pageable);

    List<Avaliavel> findAllByUnidadeTipoAvaliacaoId(final long avaliacaoUnidadeTipoId);

    List<Avaliavel> findAllByUsuarioId(final long usuarioId);

}
