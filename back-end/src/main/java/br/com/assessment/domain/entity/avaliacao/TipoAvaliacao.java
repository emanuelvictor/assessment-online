package br.com.assessment.domain.entity.avaliacao;

import br.com.assessment.domain.entity.generic.AbstractEntity;
import br.com.assessment.domain.entity.unidade.Unidade;
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
public class TipoAvaliacao extends AbstractEntity {

    @Column(nullable = false, unique = true)
    private String nome;

    @Column(nullable = false, unique = true)
    private String enunciado;

    private String um;

    private String dois;

    private String tres;

    private String quatro;

    private String cinco;

}
