package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.avaliacao.TipoAvaliacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TipoAvaliacaoRepository extends JpaRepository<TipoAvaliacao, Long> {

    @Query("SELECT tipoAvaliacao FROM TipoAvaliacao tipoAvaliacao " +
            "       LEFT OUTER JOIN UnidadeTipoAvaliacao unidadeTipoAvaliacao ON unidadeTipoAvaliacao.tipoAvaliacao.id = tipoAvaliacao.id " +
            "       LEFT OUTER JOIN Unidade unidade ON unidadeTipoAvaliacao.unidade.id = unidade.id " +
            "   WHERE " +
            "   (   " +
            "       (" +
            "           (" +
            "               unidade.id IN :unidadesFilter" +
            "           )" +
            "           OR :unidadesFilter IS NULL" +
            "       )" +
            "       AND (FILTER(:defaultFilter, tipoAvaliacao.nome, tipoAvaliacao.enunciado) = TRUE)" +
            "   )" +
            "GROUP BY tipoAvaliacao.id, tipoAvaliacao.nome, tipoAvaliacao.enunciado"
    )
    Page<TipoAvaliacao> listByFilters(@Param("defaultFilter") final String defaultFilter,
                                      @Param("unidadesFilter") final List<Long> unidadesFilter,
                                      final Pageable pageable);


    @Query("SELECT new TipoAvaliacao(id, nome, enunciado, selecao) FROM TipoAvaliacao tipoAvaliacao " +
            "   WHERE" +
            "   (" +
            "       FILTER(:defaultFilter, tipoAvaliacao.nome, tipoAvaliacao.enunciado, tipoAvaliacao.selecao) = TRUE" +
            "       AND " +
            "       (" +
            "           (" +
            "               tipoAvaliacao.id IN :idsFilter" +
            "           ) OR :idsFilter IS NULL" +
            "       )" +
            "   )" +
            "GROUP BY tipoAvaliacao.id, tipoAvaliacao.nome, tipoAvaliacao.enunciado, tipoAvaliacao.selecao"
    )
    Page<TipoAvaliacao> listLightByFilters(@Param("defaultFilter") final String defaultFilter, @Param("idsFilter") final List<Long> idsFilter, final Pageable pageable);

}
