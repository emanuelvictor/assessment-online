package br.com.assessment.domain.entity.endereco;

import br.com.assessment.domain.entity.generic.AbstractEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;
import org.hibernate.validator.constraints.Length;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * Created by Emanuel Victor on 15/03/2017.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Audited
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
    @NotNull
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Cidade cidade;

    public Endereco(Long id) {
        super(id);
    }

    public Endereco() {
    }
}