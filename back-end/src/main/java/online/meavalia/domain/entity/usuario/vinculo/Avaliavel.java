package online.meavalia.domain.entity.usuario.vinculo;

import lombok.Data;
import online.meavalia.domain.entity.generic.AbstractEntity;
import online.meavalia.domain.entity.unidade.UnidadeTipoAvaliacaoDispositivo;
import online.meavalia.domain.entity.usuario.Usuario;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"usuario_id", "unidade_tipo_avaliacao_dispositivo_id"})
})
@Cacheable
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Avaliavel extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -12345665456328951L;

    /**
     *
     */
    @NotNull
    @ManyToOne(optional = false)
    private Usuario usuario;

    /**
     *
     */
    @NotNull
    @ManyToOne(optional = false)
    @org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private UnidadeTipoAvaliacaoDispositivo unidadeTipoAvaliacaoDispositivo;

    /**
     *
     */
    private boolean ativo /*= false*/;

    /**
     *
     */
    @PrePersist
    public void prePersist() {
        this.ativo = true;
    }

}
