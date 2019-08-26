package br.com.ubest.domain.entity.usuario;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
@Inheritance(strategy = InheritanceType.JOINED)
@JsonIgnoreProperties({"authorities", "avaliaveis", "operadores"})
public class Pessoa extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -112345695623456789L;

    /**
     *
     */
    @NotEmpty
    @NotNull
    @Column(nullable = false)
    protected String nome;

    /**
     *
     */
    @Column(unique = true)
    protected String documento;

    @Transient
    protected Object media;

    @Transient
    protected long quantidadeAvaliacoes;

    @Transient
    protected long avaliacoes1;

    @Transient
    protected long avaliacoes2;

    @Transient
    protected long avaliacoes3;

    @Transient
    protected long avaliacoes4;

    @Transient
    protected long avaliacoes5;

}
