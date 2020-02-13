package online.meavalia.domain.entity.generic;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 *
 */
@Data
@MappedSuperclass
@Cacheable
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public abstract class AbstractEntity implements IEntity<Long> {

    private static final long serialVersionUID = -3875941859616104733L;

    /**
     *
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    /**
     *
     */
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @Column(nullable = false, updatable = false)
    protected LocalDateTime created;

    /**
     *
     */
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    protected LocalDateTime updated;


    /**
     *
     */
    public AbstractEntity() {
    }

    /**
     * @param id
     */
    public AbstractEntity(Long id) {
        this.setId(id);
    }

    /**
     *
     */
    @PrePersist
    protected void refreshCreated() {
        if (this.getCreated() == null) {
            this.setCreated(LocalDateTime.now());
        }
    }

    /**
     *
     */
    @PreUpdate
    protected void refreshUpdated() {
        this.refreshCreated();
        this.setUpdated(LocalDateTime.now());
    }
}
