package br.com.ubest.domain.entity.generic;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 *
 */
@Data
@MappedSuperclass
@FilterDef(name = "tenantFilter", parameters = {@ParamDef(name = "tenant", type = "string")})
@Filter(name = "tenantFilter", condition = "tenant = :tenant")
public abstract class AbstractEntity implements IEntity<Long> {

    private static final long serialVersionUID = -3875941859616104733L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Column(nullable = false)
    protected String tenant;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    @Column(nullable = false, updatable = false)
    protected LocalDateTime created;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    protected LocalDateTime updated;

    public AbstractEntity(Long id) {
        this.setId(id);
    }

    public AbstractEntity() {
    }

    @PrePersist
    protected void refreshCreated() {
        if (this.getCreated() == null) {
            this.setCreated(LocalDateTime.now());
        }
    }

    @PreUpdate
    protected void refreshUpdated() {
        this.refreshCreated();
        this.setUpdated(LocalDateTime.now());
    }
}