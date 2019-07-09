import {Abstract} from '../abstract/abstract.model';
import {UnidadeTipoAvaliacao} from "./unidade-tipo-avaliacao.model";
import {Dispositivo} from "./dispositivo.model";

export class UnidadeTipoAvaliacaoDispositivo extends Abstract {

  /**
   *
   */
  public nivel: number;

  /**
   *
   */
  public ordem: number;

  /**
   *
   */
  public unidadeTipoAvaliacao: UnidadeTipoAvaliacao;

  /**
   *
   */
  public dispositivo: Dispositivo;

}
