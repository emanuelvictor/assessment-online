package online.meavalia.domain.entity.avaliacao;

import lombok.Data;
import online.meavalia.domain.entity.generic.AbstractEntity;
import online.meavalia.domain.entity.unidade.Unidade;
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
        @UniqueConstraint(columnNames = {"tipo_avaliacao_id", "unidade_id"}),
        @UniqueConstraint(columnNames = {"unidade_id", "ordem"})
})
@Cacheable
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class UnidadeTipoAvaliacao extends AbstractEntity implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = -12345682065951632L;

    /**
     * TODO remover
     * Ordem em que a avaliação será exibida no tablet
     */
    @Column
    private Short ordem;

    /**
     *
     */
    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "tipo_avaliacao_id")
    private TipoAvaliacao tipoAvaliacao;

    /**
     *
     */
    @NotNull
    @ManyToOne(optional = false)
    private Unidade unidade;

//    /**
//     *
//     */
//    @EqualsAndHashCode.Exclude
//    @OneToMany(targetEntity = UnidadeTipoAvaliacaoDispositivo.class, mappedBy = "unidadeTipoAvaliacao", fetch = FetchType.EAGER, cascade = CascadeType.REMOVE, orphanRemoval = true)
//    private Set<UnidadeTipoAvaliacaoDispositivo> unidadesTiposAvaliacoesDispositivo;

    /**
     *
     */
    private boolean ativo;

    /**
     *
     */
    public UnidadeTipoAvaliacao() {
    }

    /**
     * @param id {Long}
     */
    public UnidadeTipoAvaliacao(Long id) {
        super(id);
    }

    /**
     *
     */
    @PrePersist
    public void prePersist() {
        this.ordem = null;
        this.ativo = this.id == null || this.id == 0 || !this.ativo;
    }

}
