package br.com.ubest.domain.entity.usuario;

import br.com.ubest.infrastructure.session.SessionDetails;
import lombok.Data;
import org.springframework.session.Session;

import javax.persistence.*;
import java.time.Duration;
import java.time.Instant;
import java.util.*;

import static br.com.ubest.Application.DEFAULT_TENANT_ID;

@Data
@Entity
@Table(schema = DEFAULT_TENANT_ID)
public class Sessao implements SessionDetails {

    private static final long serialVersionUID = 7160779239673823561L;

    /**
     * Default {@link #setMaxInactiveInterval(Duration)} (999999999 days).
     */
    public static final int DEFAULT_MAX_INACTIVE_INTERVAL_DAYS = 999999999;

    /**
     *
     */
    @Id
    private String id;

    /**
     *
     */
    @Column
    private String username;

//    /**
//     * APAGAR DO BANCO
//     */
//    @Column
//    private LocalDateTime validade;

    @Column
    private Instant creationTime = Instant.now();

    @Column
    private Instant lastAccessedTime = this.creationTime;

    /**
     * Defaults to 999999999 days.
     */
    @Transient
    public Duration maxInactiveInterval = Duration.ofDays(DEFAULT_MAX_INACTIVE_INTERVAL_DAYS);

//    private final String originalId;
    // TODO esse aqui vai ser o bicho
    @Transient
    private Map<String, Object> sessionAttrs = new HashMap<>();

    /**
     * Creates a new instance with a secure randomly generated identifier.
     */
    public Sessao() {
        this(generateId());
    }


    /**
     * Creates a new instance with the specified id. This is preferred to the default
     * constructor when the id is known to prevent unnecessary consumption on entropy
     * which can be slow.
     *
     * @param id the identifier to use
     */
    public Sessao(String id) {
        this.id = id;
    }

    /**
     * Creates a new instance from the provided {@link Session}.
     *
     * @param session the {@link Session} to initialize this {@link Session} with. Cannot
     * be null.
     */
    public Sessao(Session session) {
        if (session == null) {
            throw new IllegalArgumentException("session cannot be null");
        }
        this.id = session.getId();
        this.sessionAttrs = new HashMap<>(
                session.getAttributeNames().size());
        for (String attrName : session.getAttributeNames()) {
            Object attrValue = session.getAttribute(attrName);
            if (attrValue != null) {
                this.sessionAttrs.put(attrName, attrValue);
            }
        }
        this.lastAccessedTime = session.getLastAccessedTime();
        this.creationTime = session.getCreationTime();
        this.maxInactiveInterval = session.getMaxInactiveInterval();
    }


    @Override
    public String changeSessionId() {
        String changedId = generateId();
        setId(changedId);
        return changedId;
    }

    @Override
    public boolean isExpired() {
        return isExpired(Instant.now());
    }

    private boolean isExpired(Instant now) {
        if (this.maxInactiveInterval.isNegative()) {
            return false;
        }
        return now.minus(this.maxInactiveInterval).compareTo(this.lastAccessedTime) >= 0;
    }

    private static String generateId() {
        return UUID.randomUUID().toString();
    }

    @Override
    @SuppressWarnings("unchecked")
    public <T> T getAttribute(String attributeName) {
        return (T) this.sessionAttrs.get(attributeName);
    }

    @Override
    public Set<String> getAttributeNames() {
        return new HashSet<>(this.sessionAttrs.keySet());
    }

    @Override
    public void setAttribute(String attributeName, Object attributeValue) {
        if (attributeValue == null) {
            removeAttribute(attributeName);
        }
        else {
            this.sessionAttrs.put(attributeName, attributeValue);
        }
    }

    @Override
    public void removeAttribute(String attributeName) {
        this.sessionAttrs.remove(attributeName);
    }

    @Override
    public boolean equals(Object obj) {
        return obj instanceof Session && this.id.equals(((Session) obj).getId());
    }

    @Override
    public int hashCode() {
        return this.id.hashCode();
    }

}
