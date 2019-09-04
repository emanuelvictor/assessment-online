package br.com.ubest.domain.entity.unidade;

import br.com.ubest.domain.entity.assinatura.Assinatura;
import br.com.ubest.domain.entity.generic.AbstractEntity;
import br.com.ubest.domain.entity.generic.EntityIdResolver;
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
@JsonIdentityInfo(
        property = "id",
        scope = Assinatura.class,
        resolver = EntityIdResolver.class,
        generator = ObjectIdGenerators.PropertyGenerator.class)
@Table(schema = DEFAULT_TENANT_ID, uniqueConstraints = {
        @UniqueConstraint(columnNames = {"tenant", "nome"})
})
public class Licenca extends AbstractEntity implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = -12345852313987987L;

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
    @NotNull
    @Column(insertable = false, updatable = false)
    private long numero;

    /**
     *
     */
    @Column(length = 10)
    private String senha;

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
    @OneToMany(targetEntity = UnidadeTipoAvaliacaoLicenca.class, mappedBy = "licenca", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UnidadeTipoAvaliacaoLicenca> unidadesTiposAvaliacoesLicenca;

    /**
     *
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "assinatura_id")
    private Assinatura assinatura;

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

    /**
     * @param min
     * @param max
     * @return
     */
    private static int getRandomNumberInRange(int min, int max) {

        if (min >= max) {
            throw new IllegalArgumentException("max must be greater than min");
        }

        Random r = new Random();
        return r.nextInt((max - min) + 1) + min;
    }

}
