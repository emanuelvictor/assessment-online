package br.com.assessment.domain.entity.avaliacao;

import br.com.assessment.domain.entity.generic.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.hibernate.annotations.Cascade;
import org.hibernate.envers.Audited;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
public class Avaliacao extends AbstractEntity {

//    @OneToMany(mappedBy = "avaliacao", cascade = CascadeType.ALL, orphanRemoval = true) TODO descobrir pq esse casacade não está funcionando
//    public List<AvaliacaoColaborador> avaliacoesColaboradores;

    @NotNull
    @Column(nullable = false)
    private BigDecimal nota;

    @NotNull
    @Column(nullable = false)
//    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
//    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime data;

//    @PrePersist
//    public void prePersist() {
//        this.data = LocalDateTime.now();
//    }

}
