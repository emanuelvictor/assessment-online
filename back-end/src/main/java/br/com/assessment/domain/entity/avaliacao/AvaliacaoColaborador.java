package br.com.assessment.domain.entity.avaliacao;

import br.com.assessment.domain.entity.colaborador.Colaborador;
import br.com.assessment.domain.entity.generic.AbstractEntity;
import br.com.assessment.domain.entity.usuario.Usuario;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"colaborador_id", "avaliacao_id"})
})
public class AvaliacaoColaborador extends AbstractEntity {

    /**
     *
     */
//    @NotNull
    @ManyToOne(optional = false)
    private Colaborador colaborador;

    /**
     *
     */
//    @NotNull
    @ManyToOne(optional = false)
    private Avaliacao avaliacao;

    /**
     * @param id          long
     * @param usuarioNome String
     */
    public AvaliacaoColaborador(final long id, final String usuarioNome) {
        super(id);

        final Usuario usuario = new Usuario();
        usuario.setNome(usuarioNome);

        final Colaborador colaborador = new Colaborador();
        colaborador.setUsuario(usuario);

        this.colaborador = colaborador;
    }

    /**
     * @param id long
     */
    public AvaliacaoColaborador(final long id) {
        super(id);
    }

    /**
     *
     */
    public AvaliacaoColaborador() {
    }
}
