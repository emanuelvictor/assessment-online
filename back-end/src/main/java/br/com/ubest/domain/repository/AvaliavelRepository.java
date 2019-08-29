package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.usuario.vinculo.Avaliavel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Set;

public interface AvaliavelRepository extends JpaRepository<Avaliavel, Long> {

    @Query(
            " SELECT avaliavel FROM Avaliavel avaliavel WHERE" +
                    "(" +
                    "   (" +
                    "       (:unidadeId IS NULL AND (:usuarioId IS NOT NULL AND avaliavel.usuario.id = :usuarioId)) " +
                    "       OR " +
                    "       (:usuarioId IS NULL AND (:unidadeId IS NOT NULL AND avaliavel.unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao.unidade.id = :unidadeId))" +
                    "       OR :usuarioId IS NULL AND :unidadeId IS NULL " +
                    "   )" +
                    "   AND " +
                    "   (" +
                    "       (:unidadeTipoAvaliacaoId IS NOT NULL AND avaliavel.unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao.id = :unidadeTipoAvaliacaoId)" +
                    "       OR :unidadeTipoAvaliacaoId IS NULL  " +
                    "   )" +
                    "   AND " +
                    "   (" +
                    "       (:ativo IS NOT NULL AND avaliavel.ativo = :ativo)" +
                    "       OR :ativo IS NULL " +
                    "   )" +
                    "   AND (" +
                    "           FILTER(:defaultFilter, avaliavel.unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao.unidade.nome) = TRUE" +
                    "       OR " +
                    "           (" +
                    "               FILTER(:defaultFilter, avaliavel.unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao.tipoAvaliacao.nome, avaliavel.unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao.tipoAvaliacao.selecao, avaliavel.unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao.tipoAvaliacao.enunciado) = TRUE" +
                    "           )" +
                    "       )" +
                    ")"
    )
    Page<Avaliavel> listByFilters(@Param("defaultFilter") final String defaultFilter,
                                  @Param("usuarioId") final Long usuarioId,
                                  @Param("unidadeId") final Long unidadeId,
                                  @Param("ativo") final Boolean ativo,
                                  @Param("unidadeTipoAvaliacaoId") final Long unidadeTipoAvaliacaoId,
                                  final Pageable pageable);

    @Query(" SELECT avaliavel FROM Avaliavel avaliavel WHERE avaliavel.unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao.id = :unidadeTipoAvaliacaoId")
    Set<Avaliavel> findAllByUnidadeTipoAvaliacaoId(@Param("unidadeTipoAvaliacaoId") final long unidadeTipoAvaliacaoId);

    Set<Avaliavel> findAllByUsuarioId(final long usuarioId);

}
