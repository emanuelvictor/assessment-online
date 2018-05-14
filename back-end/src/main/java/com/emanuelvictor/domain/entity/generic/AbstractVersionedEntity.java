package com.emanuelvictor.domain.entity.generic;


import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Version;
import javax.validation.constraints.NotNull;

/**
 *
 */
@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = true)
public abstract class AbstractVersionedEntity extends AbstractEntity {

    private static final long serialVersionUID = 1172731705850432771L;

    @NotNull
    @Version
    @Column(nullable = false)
    private Long version;

    public AbstractVersionedEntity() {
    }

    public AbstractVersionedEntity(Long id) {
        super(id);
    }
}