package online.meavalia.domain.entity.unidade;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Data;
import lombok.EqualsAndHashCode;
import online.meavalia.Application;
import online.meavalia.domain.entity.assinatura.Assinatura;
import online.meavalia.domain.entity.generic.AbstractEntity;
import online.meavalia.domain.entity.usuario.Perfil;
import online.meavalia.infrastructure.tenant.TenantDetails;
import org.hibernate.envers.Audited;
import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Entity
@Audited
@lombok.EqualsAndHashCode(callSuper = true)
@Table(schema = Application.DEFAULT_TENANT_ID, uniqueConstraints = {
        @UniqueConstraint(columnNames = {"tenant", "nome"})
})
@JsonIdentityInfo(generator = ObjectIdGenerators.UUIDGenerator.class)
public class Dispositivo extends AbstractEntity implements Serializable, TenantDetails {

    /**
     *
     */
    private static final long serialVersionUID = -12345852313456791L;

    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    private boolean ativo = true;

    /**
     *
     */
    @Column
    @JsonFormat(pattern = "dd/MM/yyyy")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate dataDesativacao;

    /**
     *
     */
    @NotNull
    @Length(max = 150)
    @Column(nullable = false, updatable = false)
    private String tenant;

    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime codigoExpiration;

    /**
     *
     */
    @Column(unique = true)
    private String numeroSerie;

    /**
     *
     */
    @NotNull
    @Max(999999)
    @Min(100000)
    @Column(nullable = false, unique = true)
    private long codigo;

    /**
     *
     */
    @NotNull
    @Max(999999)
    @Min(100000)
    @Column(length = 6, nullable = false)
    private Long senha;

    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    private String nome;

    /**
     *
     */
    @NotNull
    @Column(nullable = false)
    @Min(value = 5, message = "O mínimo são 5 segundos")
    @Max(value = 600, message = "O máximo são 10 minutos (600 segundos)")
    private short time = 30;

    /**
     *
     */
    private boolean quebrarLinhaNaSelecaoDeItemAvaliavel;

    /**
     *
     */
    @EqualsAndHashCode.Exclude
    @OneToMany(targetEntity = UnidadeTipoAvaliacaoDispositivo.class, mappedBy = "dispositivo", fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    private Set<UnidadeTipoAvaliacaoDispositivo> unidadesTiposAvaliacoesDispositivo;

    /**
     *
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "assinatura_id")
    private Assinatura assinatura;

    /**
     *
     */
    public Dispositivo() {
    }

    /**
     * @param id Long
     */
    public Dispositivo(final Long id) {
        super(id);
    }

    /**
     * @return String
     */
    private static long getRandomNumberInRange() {
        final Random r = new Random();
        return r.nextInt((999999 - 100000) + 1) + 100000;
    }

    /**
     * @return Set<Unidade>
     */
    public Set<Unidade> getUnidades() {
        return this.unidadesTiposAvaliacoesDispositivo != null ? this.unidadesTiposAvaliacoesDispositivo.stream().map(unidadeTipoAvaliacaoDispositivo -> unidadeTipoAvaliacaoDispositivo.getUnidadeTipoAvaliacao().getUnidade()).collect(Collectors.toSet()) : null;
    }

    /**
     * TODO falcatrua
     *
     * @return Set<Unidade>
     */
    public void setUnidades(final Set<Unidade> unidades) {

    }

    /**
     * (non-Javadoc)
     *
     * @see org.springframework.security.core.userdetails.UserDetails#getUsername()
     */
    @Override
    @Transient
    public String getUsername() {
        return String.valueOf(this.codigo);
    }

    /**
     *
     */
    @Override
    @Transient
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {

        final Set<Perfil> authorities = new HashSet<>();

        authorities.add(Perfil.DISPOSITIVO);

        return authorities;
    }

    /**
     *
     */
    @Override
    public boolean isEnabled() {
        return this.ativo;
    }

    /**
     * @return
     */
    @Override
    public String getTenant() {
        return this.tenant;
    }

    /**
     * @return
     */
    @Override
    public String getPassword() {
        return String.valueOf(this.senha);
    }

    /**
     * @return
     */
    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return !codigoExpiration.isBefore(LocalDateTime.now().minusHours(1)); //TODO arrumar data da aplicação;
    }

    /**
     * @return
     */
    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * @return
     */
    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     *
     */
    @PreUpdate
    @PrePersist
    public void prePersistAndUpdate() {
        this.codigo = getRandomNumberInRange();
        this.codigoExpiration = LocalDateTime.now().plusHours(1);

        if (senha == null)
            senha = getRandomNumberInRange();
    }

    /**
     * @return
     */
    @JsonFormat(pattern = "dd/MM/yyyy")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    public LocalDate getDataReativacao() {
        if (this.dataDesativacao == null)
            return null;
        return this.dataDesativacao.plusMonths(6);
    }

    /**
     * @return int
     */
    public int getTimeInMilis() {
        return time * 1000;
    }
}
