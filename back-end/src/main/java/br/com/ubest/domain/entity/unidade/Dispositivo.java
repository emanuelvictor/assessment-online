package br.com.ubest.domain.entity.unidade;

import br.com.ubest.domain.entity.assinatura.Assinatura;
import br.com.ubest.domain.entity.generic.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

import static br.com.ubest.Application.DEFAULT_TENANT_ID;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
@Table(schema = DEFAULT_TENANT_ID, uniqueConstraints = {
        @UniqueConstraint(columnNames = {"tenant", "nome"})
})
@JsonIdentityInfo(generator = ObjectIdGenerators.UUIDGenerator.class)
public class Dispositivo extends AbstractEntity implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = -12345852313456791L;

    /**
     *
     */
    @NotNull
    @Column(nullable = false, updatable = false)
    @Length(max = 150)
    private String tenant;

    /**
     *
     */
    @Column
    private String numeroSerie;

    /**
     *
     */
    @Column(length = 6)
    private String senha;

    /**
     *
     */
    @NotNull
    @Column(insertable = false, updatable = false)
    private long numeroLicenca;

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
    public boolean emUso = false;

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
    private boolean modoInsonia = false;

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
    @OneToMany(targetEntity = UnidadeTipoAvaliacaoDispositivo.class, mappedBy = "dispositivo", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UnidadeTipoAvaliacaoDispositivo> unidadesTiposAvaliacoesDispositivo;

    /**
     *
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "assinatura_id")
    private Assinatura assinatura;

    /**
     *
     */
    public Dispositivo() {
    }

    /**
     * @param id Long
     */
    public Dispositivo(final Long id) {
        super(id);
    }

    /**
     * @return Set<Unidade>
     */
    public Set<Unidade> getUnidades() {
        return this.unidadesTiposAvaliacoesDispositivo != null ? this.unidadesTiposAvaliacoesDispositivo.stream().map(unidadeTipoAvaliacaoDispositivo -> unidadeTipoAvaliacaoDispositivo.getUnidadeTipoAvaliacao().getUnidade()).collect(Collectors.toSet()) : null;
    }

    /**
     *
     * @return Set<Unidade>
     */
    public void setUnidades(final Set<Unidade> unidades) {

    }

    /**
     *
     */
    @PreUpdate
    public void prePersist() {
        if (numeroSerie != null)
            this.senha = getRandomNumberInRange();
    }

    /**
     * @return String
     */
    private static String getRandomNumberInRange() {
        final Random r = new Random();
        return String.valueOf(r.nextInt((999999 - 100000) + 1) + 100000);
    }

}
