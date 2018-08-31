package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.usuario.Perfil;
import br.com.assessment.domain.entity.usuario.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    @Query(
            "SELECT usuario FROM Usuario usuario WHERE " +
                    "(   " +
                    "   (:perfil != '" + Perfil.ADMINISTRADOR_VALUE + "' AND usuario.id IN " +
                    "   (" +
                    "       SELECT colaborador.usuario.id FROM Colaborador colaborador WHERE " +
                    "       (" +
                    "           colaborador.vinculo < 3 AND colaborador.unidade.id IN " +
                    "           (" +
                    "               SELECT operador.unidade.id FROM Colaborador operador WHERE " +
                    "               (" +
                    "                   operador.usuario.id = :usuarioId" +
                    "                   AND " +
                    "                   (" +
                    "                       (operador.vinculo = 1 OR operador.vinculo = 2)" +
                    "                   )" +
                    "               )" +
                    "           )" +
                    "       )" +
                    "   ) " +
                    "   OR :perfil = '" + Perfil.ADMINISTRADOR_VALUE + "'" +
                    "   )" +
                    "   AND " +
                    "   (" +
                    "       FILTER(usuario.nome, :defaultFilter) = TRUE" +
                    "       OR FILTER(usuario.conta.email, :defaultFilter) = TRUE" +
                    "   )" +
                    "   AND " +
                    "   (" +
                    "       usuario.id IN " +
                    "       (" +
                    "           SELECT colaborador.usuario.id FROM Colaborador colaborador WHERE " +
                    "           (" +
                    "                   colaborador.unidade.id  IN :unidadesFilter " +
                    "           )" +
                    "       )" +
                    "       OR :unidadesFilter IS NULL" +
                    "   )" +
                    ")"
    )
    Page<Usuario> listByFilters(@Param("usuarioId") final Long usuarioId,
                                @Param("perfil") final String perfil,
                                @Param("defaultFilter") final String defaultFilter,
                                @Param("unidadesFilter") final List<Long> unidadesFilter,
                                final Pageable pageable);
}
