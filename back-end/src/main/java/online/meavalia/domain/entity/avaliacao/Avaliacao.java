package online.meavalia.domain.entity.avaliacao;

import online.meavalia.domain.entity.generic.AbstractEntity;
import online.meavalia.domain.entity.unidade.Unidade;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Data;
import org.hibernate.envers.Audited;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.UUIDGenerator.class)
public class Avaliacao extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -951100332065317651L;

    /**
     *
     */
    @OneToMany(targetEntity = AvaliacaoAvaliavel.class, mappedBy = "avaliacao", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    public List<AvaliacaoAvaliavel> avaliacoesAvaliaveis;

    /**
     *
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "agrupador_id")
    private Agrupador agrupador;

    /**
     *
     */
    @NotNull
    @Column(nullable = false, columnDefinition = "NUMERIC(19,0)")
    private int nota;

    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime data;

    /**
     *
     */
    @Column
    @JsonIgnore
    private byte[] foto;

    /**
     *
     */
    @Column
    private String fotoPath;

    /**
     *
     */
    @Transient
    private Unidade unidade;

    /**
     *
     */
    @Transient
    private TipoAvaliacao tipoAvaliacao;

    /**
     *
     */
    public Avaliacao() {
    }

    /**
     * @param id
     * @param fotoPath
     * @param nota
     * @param data
     * @param agrupador
     * @param unidade
     * @param tipoAvaliacao
     */
    public Avaliacao(final long id, final String fotoPath, final @NotNull int nota, final @NotNull LocalDateTime data, final Agrupador agrupador, final Unidade unidade, final TipoAvaliacao tipoAvaliacao) {
        super(id);
        this.nota = nota;
        this.data = data;
        this.fotoPath = fotoPath;
        this.unidade = unidade;
        this.tipoAvaliacao = tipoAvaliacao;
        this.agrupador = agrupador;
    }

    /**
     *
     */
    @PrePersist
    public void prePersist() {

        if (this.foto != null)
            this.fotoPath = "./avaliacoes/" + id + "/foto";
        else
            this.fotoPath = null;

        this.data = LocalDateTime.now();
    }

}
