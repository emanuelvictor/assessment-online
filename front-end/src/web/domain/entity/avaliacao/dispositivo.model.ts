import {Abstract} from '../abstract/abstract.model';
import {UnidadeTipoAvaliacaoDispositivo} from "./unidade-tipo-avaliacao-dispositivo.model";

export class Dispositivo extends Abstract {

  /**
   *
   */
  public publico: boolean;

  /**
   *
   */
  public codigo: string;

  /**
   *
   */
  public unidadesTiposAvaliacoesDispositivos: UnidadeTipoAvaliacaoDispositivo[] = [];

}
