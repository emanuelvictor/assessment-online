package br.com.ubest.domain.entity.unidade;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.envers.Audited;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;
import java.util.Set;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.UUIDGenerator.class)
public class Dispositivo extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -12345665123987987L;

    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    private boolean publico = false;

    /**
     *
     */
    @Length(max = 150)
    @Column(nullable = false, length = 150, unique = true)
    private String codigo;

    /**
     *
     */
    @EqualsAndHashCode.Exclude
    @OneToMany(targetEntity = UnidadeTipoAvaliacaoDispositivo.class, mappedBy = "dispositivo", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UnidadeTipoAvaliacaoDispositivo> unidadesTiposAvaliacoesDispositivo;

    /**
     *
     */
    public Dispositivo() {
    }

    /**
     * @param id
     */
    public Dispositivo(Long id) {
        super(id);
    }
}
