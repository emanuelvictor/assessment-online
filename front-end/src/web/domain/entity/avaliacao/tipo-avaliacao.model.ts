import {Abstract} from '../abstract/abstract.model';

export class TipoAvaliacao extends Abstract {

  /**
   *
   */
  public nome: string;

  /**
   *
   */
  public enunciado: string;

  /**
   *
   */
  public selecao: string;

  /**
   *
   */
  constructor() {
    super();
  }

}