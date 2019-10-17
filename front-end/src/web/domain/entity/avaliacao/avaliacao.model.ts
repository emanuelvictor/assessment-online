import {Abstract} from '../abstract/abstract.model';
import {AvaliacaoAvaliavel} from './avaliacao-avaliavel.model';
import {Agrupador} from './agrupador.model';

export class Avaliacao extends Abstract {

  public avaliacoesAvaliaveis: AvaliacaoAvaliavel[];

  public nota: number;

  public data: any;

  public fotoPath: string;

  public atendentes: any;

  public agrupador: Agrupador;


  constructor() {
    super();
    this.agrupador = new Agrupador()
  }
}
