import {Abstract} from '../abstract/Abstract.model';
import {AvaliacaoColaborador} from './AvaliacaoColaborador.model';

export class Avaliacao extends Abstract {

  public avaliacoesColaboradores: AvaliacaoColaborador[];

  public nota: number;

  public data: any;
}