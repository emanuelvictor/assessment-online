package br.com.assessment.domain.entity.avaliacao;

import br.com.assessment.domain.entity.generic.AbstractEntity;
import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.entity.usuario.vinculo.Avaliavel;
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
        @UniqueConstraint(columnNames = {"avaliavel_id", "avaliacao_id"})
})
public class AvaliacaoAvaliavel extends AbstractEntity {

    /**
     *
     */
//    @NotNull
    @ManyToOne(optional = false)
    private Avaliavel avaliavel;

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
    public AvaliacaoAvaliavel(final long id, final String usuarioNome) {
        super(id);

        final Usuario usuario = new Usuario();
        usuario.setNome(usuarioNome);

        final Avaliavel avaliavel = new Avaliavel();
        avaliavel.setUsuario(usuario);

        this.avaliavel = avaliavel;
    }

    /**
     * @param id long
     */
    public AvaliacaoAvaliavel(final long id) {
        super(id);
    }

    /**
     *
     */
    public AvaliacaoAvaliavel() {
    }
}
