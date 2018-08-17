package br.com.assessment.domain.entity.generic;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 *
 */
@Data
@MappedSuperclass
@JsonIdentityInfo(generator = ObjectIdGenerators.UUIDGenerator.class)
public abstract class AbstractEntity implements IEntity<Long> {

    private static final long serialVersionUID = -3875941859616104733L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

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