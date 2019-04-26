package br.com.ubest.domain.entity.avaliacao;

import br.com.ubest.domain.entity.generic.AbstractEntity;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.envers.Audited;

import javax.persistence.Column;
import javax.persistence.Entity;

@Data
@Entity
@Audited
@NoArgsConstructor
@lombok.EqualsAndHashCode(callSuper = true)
public class TipoAvaliacao extends AbstractEntity {

    @Column(nullable = false, unique = true)
    private String nome;

    @Column(nullable = false)
    private String enunciado;

    @Column(nullable = false)
    private String selecao;

    private String um;

    private String dois;

    private String tres;

    private String quatro;

    private String cinco;


    public TipoAvaliacao(final Long id, final String nome, final String enunciado, final String selecao) {
        super(id);
        this.nome = nome;
        this.enunciado = enunciado;
        this.selecao = selecao;
    }
}
