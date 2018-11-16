import {Abstract} from '../abstract/abstract.model';
import {AvaliacaoColaborador} from "./avaliacao-colaborador.model";

export class Avaliacao extends Abstract {

  public avaliacoesColaboradores: AvaliacaoColaborador[];

  public nota: number;

  public data: any;

  public fotoPath: string;

  public atendentes: any;

}