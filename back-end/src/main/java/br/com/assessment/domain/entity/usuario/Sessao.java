package br.com.assessment.domain.entity.usuario;

import br.com.assessment.domain.entity.generic.AbstractEntity;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.UUID;

import static br.com.assessment.application.context.LocalContext.DEFAULT_TENANT_ID;

@Data
@Entity
@Audited
@Table(schema = DEFAULT_TENANT_ID)
@lombok.EqualsAndHashCode(callSuper = true)
public class Sessao extends AbstractEntity {

    @Column(nullable = false)
    private String username;

    @Column(nullable = false, unique = true)
    private String token;

    @Column
    private LocalDateTime validade;

    /**
     * Criar a validação por data
     */
    public boolean validate() {
        return true;
    }

    /**
     *
     */
    public void generateToken() {
        this.setToken(UUID.randomUUID().toString());
    }

}
