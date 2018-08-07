import {Abstract} from '../abstract/Abstract.model';
import {Avaliacao} from './avaliacao.model';
import {Colaborador} from '../colaborador/colaborador.model';

export class AvaliacaoColaborador extends Abstract {

  public colaborador: Colaborador;

  public avaliacao: Avaliacao;

}