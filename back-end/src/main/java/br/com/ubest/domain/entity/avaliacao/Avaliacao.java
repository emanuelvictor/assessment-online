package br.com.ubest.domain.entity.avaliacao;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import br.com.ubest.domain.entity.unidade.Unidade;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Data;
import org.hibernate.envers.Audited;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.UUIDGenerator.class)
public class Avaliacao extends AbstractEntity {

    @OneToMany(targetEntity = AvaliacaoAvaliavel.class, mappedBy = "avaliacao", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    public List<AvaliacaoAvaliavel> avaliacoesAvaliaveis;

    @NotNull
    @Column(nullable = false, columnDefinition = "NUMERIC(19,0)")
    private int nota;

    @NotNull
    @Column(nullable = false)
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime data;

    @ManyToOne(optional = false, targetEntity = Agrupador.class, cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "agrupador_id")
    private Agrupador agrupador;

    @Column
    @JsonIgnore
    private byte[] foto;

    @Column
    private String fotoPath;

    @Transient
    private Unidade unidade;

    public Avaliacao() {
    }

    public Avaliacao(final long id, final String fotoPath, final @NotNull int nota, final @NotNull LocalDateTime data, final Unidade unidade) {
        super(id);
        this.nota = nota;
        this.data = data;
        this.fotoPath = fotoPath;
        this.unidade = unidade;
    }

    @PrePersist
    public void prePersist() {

        if (this.foto != null)
            this.fotoPath = "./avaliacoes/" + id + "/foto";
        else
            this.fotoPath = null;

        this.data = LocalDateTime.now();
    }

}
