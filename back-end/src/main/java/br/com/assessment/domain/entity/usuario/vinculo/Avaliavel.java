package br.com.assessment.domain.entity.usuario.vinculo;

import br.com.assessment.domain.entity.avaliacao.UnidadeTipoAvaliacao;
import br.com.assessment.domain.entity.generic.AbstractEntity;
import br.com.assessment.domain.entity.unidade.Unidade;
import br.com.assessment.domain.entity.usuario.Usuario;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"usuario_id", "unidade_tipo_avaliacao_id"})
})
public class Avaliavel extends AbstractEntity {

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
    private UnidadeTipoAvaliacao unidadeTipoAvaliacao;

}
