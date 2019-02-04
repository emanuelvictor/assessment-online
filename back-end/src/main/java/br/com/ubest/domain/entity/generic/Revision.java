package br.com.ubest.domain.entity.generic;

import lombok.Data;
import org.hibernate.envers.RevisionNumber;
import org.hibernate.envers.RevisionTimestamp;

import javax.persistence.*;
import java.io.Serializable;

import static br.com.ubest.application.context.LocalContext.DEFAULT_TENANT_ID;


/**
 * @param <T>
 * @param <ID>
 */
@Data
@Entity
@lombok.EqualsAndHashCode
@Table(schema = DEFAULT_TENANT_ID)
@org.hibernate.envers.RevisionEntity(EntityTrackingRevisionListener.class)
class Revision<T extends IEntity<ID>, ID extends Serializable> implements Serializable {
    /**
     *
     */
    private static final long serialVersionUID = 4193623660483050410L;

    /**
     * id da {@link Revision}
     */
    @Id
    @RevisionNumber
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    /**
     * data da {@link Revision}
     */
    @RevisionTimestamp
    private long timestamp;

    /**
     * esquema da revisão
     */
    private String schema;

    /**
     * Username do usuário logado {@link Revision}
     */
    private String username;

    /**
     * entidade da {@link Revision}
     */
    @Transient
    private T entity;

}