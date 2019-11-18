package online.meavalia.domain.entity.avaliacao;

import online.meavalia.domain.entity.generic.AbstractEntity;
import online.meavalia.domain.entity.usuario.Usuario;
import online.meavalia.domain.entity.usuario.vinculo.Avaliavel;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"avaliavel_id", "avaliacao_id"})
})
public class AvaliacaoAvaliavel extends AbstractEntity implements Serializable {
    private static final long serialVersionUID = -12345682065317162L;


    /**
     *
     */
//    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "avaliacao_id")
    private Avaliacao avaliacao;

    /**
     *
     */
//    @NotNull
    @ManyToOne(optional = false)
    private Avaliavel avaliavel;

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
