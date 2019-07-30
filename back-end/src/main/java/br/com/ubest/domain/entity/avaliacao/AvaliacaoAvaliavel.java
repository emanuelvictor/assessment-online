package br.com.ubest.domain.entity.avaliacao;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import br.com.ubest.domain.entity.usuario.Usuario;
import br.com.ubest.domain.entity.usuario.vinculo.Avaliavel;
import lombok.Data;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
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

@FilterDef(name = "tenantFilter", parameters = {@ParamDef(name = "tenant", type = "string")})
@Filter(name = "tenantFilter", condition = "tenant = :tenant")
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
