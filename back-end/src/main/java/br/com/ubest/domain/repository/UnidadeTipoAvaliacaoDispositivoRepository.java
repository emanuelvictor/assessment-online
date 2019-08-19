package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.unidade.UnidadeTipoAvaliacaoDispositivo;
import br.com.ubest.domain.entity.usuario.Perfil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UnidadeTipoAvaliacaoDispositivoRepository extends JpaRepository<UnidadeTipoAvaliacaoDispositivo, Long> {

//    @Query("FROM UnidadeTipoAvaliacaoDispositivo unidadeTipoAvaliacaoDispositivo WHERE " +
//            "   (   " +
//            "       (" +
//            "           FILTER(:defaultFilter, unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade.nome) = TRUE" +
//            "       )" +
//            "       AND" +
//            "       (" +
//            "           :dispositivoId IS NOT NULL AND " +
//            "           (" +
//            "               unidadeTipoAvaliacaoDispositivo.dispositivos.id = :dispositivoId" +
//            "           )" +
//            "           OR :dispositivoId IS NULL " +
//            "       )" +
//            "   )")
//    Page<UnidadeTipoAvaliacaoDispositivo> listByFilters(@Param("defaultFilter") final String defaultFilter,
//                                                        @Param("dispositivoId") final Long dispositivoId,
//                                                        final Pageable pageable);

    @Query("FROM UnidadeTipoAvaliacaoDispositivo unidadeTipoAvaliacaoDispositivo WHERE " +
            "   (   " +
            "       (" +
            "           FILTER(:defaultFilter, unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade.nome) = TRUE" +
            "       )" +
            "       AND" +
            "       (" +
            "           :dispositivoId IS NOT NULL AND " +
            "           (" +
            "               unidadeTipoAvaliacaoDispositivo.dispositivo.id = :dispositivoId" +
            "           )" +
            "           OR :dispositivoId IS NULL " +
            "       )" +
            "       AND" +
            "       (" +
            "           :unidadeTipoAvaliacaoId IS NOT NULL AND " +
            "           (" +
            "               unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.id = :unidadeTipoAvaliacaoId" +
            "           )" +
            "           OR :unidadeTipoAvaliacaoId IS NULL " +
            "       )" +
            "   )")
    Page<UnidadeTipoAvaliacaoDispositivo> listByFilters(@Param("defaultFilter") final String defaultFilter,
                                                        @Param("dispositivoId") final Long dispositivoId,
                                                        @Param("unidadeTipoAvaliacaoId") final Long unidadeTipoAvaliacaoId,
                                                        final Pageable pageable);

}
