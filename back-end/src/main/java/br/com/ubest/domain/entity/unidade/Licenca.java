package br.com.ubest.domain.entity.unidade;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.UUIDGenerator.class)
public class Licenca extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -12345665123987987L;

    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    private String nome;

    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    private boolean interna = false;

    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    private boolean modoQuiosque = false;

    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    private boolean modoInsonia;

    /**
     *
     */
    @Min(value = 5, message = "O mínimo são 5 segundos")
    @Max(value = 600, message = "O máximo são 10 minutos (600 segundos)")
    private short time = 30;

    /**
     *
     */
    private boolean quebrarLinhaNaSelecaoDeItemAvaliavel;

    /**
     *
     */
    @EqualsAndHashCode.Exclude
    @OneToMany(targetEntity = UnidadeTipoAvaliacaoLicenca.class, mappedBy = "licenca", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UnidadeTipoAvaliacaoLicenca> unidadesTiposAvaliacoesLicenca;

    /**
     *
     */
    public Licenca() {
    }

    /**
     * @param id Long
     */
    public Licenca(Long id) {
        super(id);
    }

    /**
     * @return Set<Unidade>
     */
    public Set<Unidade> getUnidades() {
        return this.unidadesTiposAvaliacoesLicenca != null ? this.unidadesTiposAvaliacoesLicenca.stream().map(unidadeTipoAvaliacaoLicenca -> unidadeTipoAvaliacaoLicenca.getUnidadeTipoAvaliacao().getUnidade()).collect(Collectors.toSet()) : null;
    }
}
