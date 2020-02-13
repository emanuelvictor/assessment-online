package online.meavalia.domain.entity.avaliacao;

import lombok.Data;
import lombok.NoArgsConstructor;
import online.meavalia.domain.entity.generic.AbstractEntity;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.envers.Audited;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import java.io.Serializable;

@Data
@Entity
@Audited
@NoArgsConstructor
@lombok.EqualsAndHashCode(callSuper = true)
@Cacheable
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class TipoAvaliacao extends AbstractEntity implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = -2224100382065317162L;

    /**
     *
     */
    @Column(nullable = false, unique = true)
    private String nome;

    /**
     *
     */
    @Column(nullable = false)
    private String enunciado;

    /**
     *
     */
    @Column(nullable = false)
    private String selecao;

    /**
     *
     */
    private String um;

    /**
     *
     */
    private String dois;

    /**
     *
     */
    private String tres;

    /**
     *
     */
    private String quatro;

    /**
     *
     */
    private String cinco;

//    /**
//     *
//     */
//    @EqualsAndHashCode.Exclude
//    @OneToMany(targetEntity = UnidadeTipoAvaliacao.class, mappedBy = "tipoAvaliacao", fetch = FetchType.EAGER, cascade = CascadeType.REMOVE, orphanRemoval = true)
//    private Set<UnidadeTipoAvaliacao> unidadesTiposAvaliacoes;

    /**
     * @param id
     * @param nome
     * @param enunciado
     * @param selecao
     */
    public TipoAvaliacao(final Long id, final String nome, final String enunciado, final String selecao) {
        super(id);
        this.nome = nome;
        this.enunciado = enunciado;
        this.selecao = selecao;
    }
}
