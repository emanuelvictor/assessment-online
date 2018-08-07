import {Abstract} from '../abstract/abstract.model';
import {Avaliacao} from './avaliacao.model';
import {Colaborador} from '../colaborador/colaborador.model';

export class AvaliacaoColaborador extends Abstract {

  public colaborador: Colaborador;

  public avaliacao: Avaliacao;

}