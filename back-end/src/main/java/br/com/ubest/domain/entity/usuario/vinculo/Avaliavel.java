package br.com.ubest.domain.entity.usuario.vinculo;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import br.com.ubest.domain.entity.unidade.UnidadeTipoAvaliacaoLicenca;
import br.com.ubest.domain.entity.usuario.Usuario;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"usuario_id", "unidade_tipo_avaliacao_licenca_id"})
})
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
    private UnidadeTipoAvaliacaoLicenca unidadeTipoAvaliacaoLicenca;

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
