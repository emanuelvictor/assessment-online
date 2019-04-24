import {Abstract} from '../abstract/abstract.model';
import {AvaliacaoAvaliavel} from "./avaliacao-avaliavel.model";
import {Avaliacao} from "./avaliacao.model";

export class Agrupador extends Abstract {

  public avaliacoes: Avaliacao[];

  public feedback: string;

}
