package br.com.assessment.domain.entity.avaliacao;

import br.com.assessment.domain.entity.generic.AbstractEntity;
import br.com.assessment.domain.entity.usuario.Usuario;
import br.com.assessment.domain.entity.vinculo.Colaborador;

import java.io.Serializable;

public class RespostaColaborador extends AbstractEntity implements Serializable {

    private Usuario usuario;

    private Colaborador colaborador;

}
