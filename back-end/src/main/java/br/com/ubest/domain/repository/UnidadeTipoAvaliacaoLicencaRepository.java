package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.unidade.UnidadeTipoAvaliacaoLicenca;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UnidadeTipoAvaliacaoLicencaRepository extends JpaRepository<UnidadeTipoAvaliacaoLicenca, Long> {

//    @Query("FROM UnidadeTipoAvaliacaoLicenca unidadeTipoAvaliacaoLicenca WHERE " +
//            "   (   " +
//            "       (" +
//            "           FILTER(:defaultFilter, unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao.unidade.nome) = TRUE" +
//            "       )" +
//            "       AND" +
//            "       (" +
//            "           :licencaId IS NOT NULL AND " +
//            "           (" +
//            "               unidadeTipoAvaliacaoLicenca.licenca.id = :licencaId" +
//            "           )" +
//            "           OR :licencaId IS NULL " +
//            "       )" +
//            "   )")
//    Page<UnidadeTipoAvaliacaoLicenca> listByFilters(@Param("defaultFilter") final String defaultFilter,
//                                                        @Param("licencaId") final Long licencaId,
//                                                        final Pageable pageable);

    @Query("FROM UnidadeTipoAvaliacaoLicenca unidadeTipoAvaliacaoLicenca WHERE " +
            "   (   " +
            "       ((:ativo IS NOT NULL AND unidadeTipoAvaliacaoLicenca.ativo = :ativo) OR :ativo IS NULL)" +
            "       AND " +
            "       (" +
            "           FILTER(:defaultFilter, unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao.unidade.nome) = TRUE" +
            "       )" +
            "       AND" +
            "       (" +
            "           :licencaId IS NOT NULL AND " +
            "           (" +
            "               unidadeTipoAvaliacaoLicenca.licenca.id = :licencaId" +
            "           )" +
            "           OR :licencaId IS NULL " +
            "       )" +
            "       AND" +
            "       (" +
            "           :unidadeTipoAvaliacaoId IS NOT NULL AND " +
            "           (" +
            "               unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao.id = :unidadeTipoAvaliacaoId" +
            "           )" +
            "           OR :unidadeTipoAvaliacaoId IS NULL " +
            "       )" +
            "   )")
    Page<UnidadeTipoAvaliacaoLicenca> listByFilters(@Param("defaultFilter") final String defaultFilter,
                                                    @Param("licencaId") final Long licencaId,
                                                    @Param("unidadeTipoAvaliacaoId") final Long unidadeTipoAvaliacaoId,
                                                    @Param("ativo") final Boolean ativo,
                                                    final Pageable pageable);

}
