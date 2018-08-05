package br.com.assessment.domain.entity.usuario;

import br.com.assessment.domain.entity.generic.AbstractEntity;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import static br.com.assessment.application.multitenancy.TenantIdentifierResolver.DEFAULT_TENANT_ID;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
@Table(schema = DEFAULT_TENANT_ID)
public class Tenant extends AbstractEntity {

    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    private String esquema;

    /**
     *
     */
    public Tenant() {
    }

    /**
     *
     */
    public Tenant(final String schema) {
        this.setEsquema(schema);
    }

//    /**
//     * @return
//     */
//    public String getEsquema() {
//        // Se o esquema é nulo e o usuário não é, seta como esquema o id do usuário
//        if (esquema == null && (this.usuario != null && this.usuario.getId() != null))
//            this.esquema = this.usuario.getId().toString();
//
//        // Se o esquema é nulo e o usuário também é, seta como esquema o esquema padrão "public"
//        if (esquema == null && (this.usuario == null || this.usuario.getId() == null))
//            this.esquema = TenantIdentifierResolver.DEFAULT_TENANT_ID;
//
//        return esquema;
//    }

}
