package br.com.assessment.domain.repository;

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
                    "   (" +
                    "       FILTER(usuario.nome, :defaultFilter) = TRUE" +
                    "       OR FILTER(usuario.conta.email, :defaultFilter) = TRUE" +
                    "   )" +
                    "   AND " +
                    "   (" +
                    "       (" +
                    "           :unidadesFilter IS NOT NULL AND usuario.id IN " +
                    "           (" +
                    "               colaborador.usuario.id FROM Colaborador colaborador WHERE " +
                    "               (" +
                    "                   colaborador.unidade.id  IN :unidadesFilter " +
                    "               )" +
                    "           )" +
                    "       )" +
                    "       OR :unidadesFilter IS NULL" +
                    "   )"
    )
    Page<Usuario> listByFilters(@Param("defaultFilter") final String defaultFilter,
                                @Param("unidadesFilter") final List<Long> unidadesFilter,
                                final Pageable pageable);
}
