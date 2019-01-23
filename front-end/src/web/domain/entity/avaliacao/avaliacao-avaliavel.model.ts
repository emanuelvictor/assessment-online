import {Abstract} from '../abstract/abstract.model';
import {Avaliacao} from './avaliacao.model';
import {Avaliavel} from "../usuario/vinculo/avaliavel.model";

export class AvaliacaoAvaliavel extends Abstract {

  public avaliavel: Avaliavel;

  public avaliacao: Avaliacao;

}