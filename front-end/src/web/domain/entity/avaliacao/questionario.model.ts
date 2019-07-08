import {Abstract} from '../abstract/abstract.model';
import {Ordem} from "./ordem.model";

export class Questionario extends Abstract {

  /**
   *
   */
  public codigo: string;

  /**
   *
   */
  public ordens: Ordem[];

}
