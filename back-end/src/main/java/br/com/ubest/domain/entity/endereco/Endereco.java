package br.com.ubest.domain.entity.endereco;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import org.hibernate.envers.Audited;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * Created by Emanuel Victor on 15/03/2017.
 */
@Data
@Entity
@Audited
@EqualsAndHashCode(callSuper = false)

@FilterDef(name = "tenantFilter", parameters = {@ParamDef(name = "tenant", type = "string")})
@Filter(name = "tenantFilter", condition = "tenant = :tenant")
public class Endereco extends AbstractEntity implements Serializable {

    private static final long serialVersionUID = -1234564552908065252L;

    @Length(max = 200)
    @Column(length = 200)
    private String logradouro;


    @Length(max = 200)
    @Column(length = 200)
    private String complemento;


    @Length(max = 200)
    @Column(length = 200)
    private String bairro;


    @Length(max = 9)
    @Column
    private String cep;


    @Length(max = 20)
    @Column(length = 20)
    private String numero;

    /**
     * {@link Cidade }
     */
    @ManyToOne(fetch = FetchType.EAGER)
    private Cidade cidade;

}
