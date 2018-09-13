package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.usuario.Perfil;
import br.com.assessment.domain.entity.usuario.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    @Query(
            "SELECT new Usuario( usuario.id, usuario.nome, usuario.conta.email, usuario.thumbnailPath,  usuario.avatarPath, usuario.fotoPath, SUM(avaliacao.nota) ) FROM Usuario usuario " +
                    "   LEFT OUTER JOIN Colaborador colaborador ON colaborador.usuario.id = usuario.id " +
                    "   LEFT OUTER JOIN AvaliacaoColaborador avaliacaoColaborador ON avaliacaoColaborador.colaborador.id = colaborador.id " +
                    "   LEFT OUTER JOIN Avaliacao avaliacao ON avaliacao.id = avaliacaoColaborador.avaliacao.id " +
                    "WHERE (   " +
                    "   (" +
//                    "   :perfil != '" + Perfil.ADMINISTRADOR_VALUE + "' " +
//                    "   AND " +
                    "   usuario.id IN " +
                    "   (" +
                    "       SELECT colaborador.usuario.id FROM Colaborador colaborador " +
                    "       WHERE " +
//                    "       (" +
//                    "           colaborador.vinculo < 3 AND colaborador.unidade.id IN " +
//                    "           (" +
//                    "               SELECT operador.unidade.id FROM Colaborador operador WHERE " +
//                    "               (" +
//                    "                   operador.usuario.id = :usuarioId" +
//                    "                   AND (operador.vinculo = 1 OR operador.vinculo = 2)" +
//                    "               )" +
//                    "           )" +
//                    "           AND " +
//                    "           (" +
                    "               (" +
//                    "                   ((cast(:dataInicioFilter AS date)) IS NOT NULL OR (cast(:dataTerminoFilter AS date)) IS NOT NULL " +
//                    "                   AND" +
                    "                   (" +
                    "                       colaborador.id IN " +
                    "                       (" +
                    "                           SELECT avaliacaoColaborador.colaborador.id FROM AvaliacaoColaborador avaliacaoColaborador " +
                    "                           WHERE(" +
                    "                               (" +
                    "                                   (cast(:dataInicioFilter AS date)) IS NOT NULL AND (cast(:dataTerminoFilter AS date)) IS NOT NULL " +
                    "                                   AND " +
                    "                                       :dataInicioFilter <= avaliacaoColaborador.avaliacao.data " +
                    "                                   AND avaliacaoColaborador.avaliacao.data <= :dataTerminoFilter" +
                    "                               )" +
                    "                               OR" +
                    "                               (" +
                    "                                   (cast(:dataInicioFilter AS date)) IS NOT NULL AND (cast(:dataTerminoFilter AS date)) IS NULL " +
                    "                                   AND :dataInicioFilter <= avaliacaoColaborador.avaliacao.data " +
                    "                               )" +
                    "                               OR" +
                    "                               (" +
                    "                                   (cast(:dataInicioFilter AS date)) IS NULL AND (cast(:dataTerminoFilter AS date)) IS NOT NULL " +
                    "                                   AND avaliacaoColaborador.avaliacao.data <= :dataTerminoFilter " +
                    "                               )" +
                    "                               OR (cast(:dataInicioFilter AS date)) IS NULL AND (cast(:dataTerminoFilter AS date)) IS NULL" +
                    "                           )" +
                    "                       ) " +
                    "                   )" +
//                    ")" +
                    "               )" +
//                    "               AND" +
//                    "               (" +
//                    "                   (cast(:dataTerminoFilter AS date)) IS NOT NULL " +
//                    "                   AND " +
//                    "                   (" +
//                    "                       colaborador.usuario.id IN " +
//                    "                       (" +
//                    "                           SELECT avaliacaoColaborador.colaborador.usuario.id FROM AvaliacaoColaborador avaliacaoColaborador " +
//                    "                           WHERE (" +
//                    "                               avaliacaoColaborador.avaliacao.data < :dataTerminoFilter" +
//                    "                           )" +
//                    "                       )" +
//                    "                   )" +
//                    "                   OR (cast(:dataTerminoFilter AS date)) IS NULL " +
//                    "               ) " +
//                    "           )" +
//                    "       )" +
                    "   ) " +
//                    "   OR :perfil = '" + Perfil.ADMINISTRADOR_VALUE + "'" +
                    "   )" +
//                    "   AND " +
//                    "   (" +
//                    "       FILTER(usuario.nome, :defaultFilter) = TRUE" +
//                    "       OR FILTER(usuario.conta.email, :defaultFilter) = TRUE" +
//                    "   )" +
//                    "   AND " +
//                    "   (" +
//                    "       usuario.id IN " +
//                    "       (" +
//                    "           SELECT colaborador.usuario.id FROM Colaborador colaborador WHERE " +
//                    "           (" +
//                    "                   colaborador.unidade.id IN :unidadesFilter " +
//                    "           )" +
//                    "       )" +
//                    "       OR :unidadesFilter IS NULL" +
//                    "   )" +
                    ") group by usuario.id, usuario.nome, usuario.conta.email, usuario.thumbnailPath, usuario.avatarPath, usuario.fotoPath"
    )
    Page<Usuario> listByFilters(
//            @Param("usuarioId") final Long usuarioId,
//                                @Param("perfil") final String perfil,
//                                @Param("defaultFilter") final String defaultFilter,
//                                @Param("unidadesFilter") final List<Long> unidadesFilter,
                                @Param("dataInicioFilter") final LocalDateTime dataInicioFilter,
                                @Param("dataTerminoFilter") final LocalDateTime dataTerminoFilter,
                                final Pageable pageable);
}
