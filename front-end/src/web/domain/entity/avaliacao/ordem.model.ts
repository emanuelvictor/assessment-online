import {Abstract} from '../abstract/abstract.model';
import {UnidadeTipoAvaliacao} from "./unidade-tipo-avaliacao.model";
import {Questionario} from "./questionario.model";

export class Ordem extends Abstract {

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
  public questionario: Questionario;

}
