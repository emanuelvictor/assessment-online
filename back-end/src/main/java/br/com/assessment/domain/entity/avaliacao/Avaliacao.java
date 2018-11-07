package br.com.assessment.domain.entity.avaliacao;

import br.com.assessment.domain.entity.generic.AbstractEntity;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrePersist;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
public class Avaliacao extends AbstractEntity {

//    @OneToMany(mappedBy = "avaliacao", cascade = CascadeType.ALL, orphanRemoval = true) TODO descobrir pq esse casacade não está funcionando
//    public List<AvaliacaoColaborador> avaliacoesColaboradores;

    @NotNull
    @Column(nullable = false)
    private int nota;

    @NotNull
    @Column(nullable = false)
//    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
//    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime data;

    @PrePersist
    public void prePersist() {
        this.data = LocalDateTime.now();
    }

}
