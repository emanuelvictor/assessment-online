import {Abstract} from '../abstract/abstract.model';

export class Cupom extends Abstract {

  /**
   *
   */
  public codigo: string;

  /**
   *
   */
  public percentualDesconto: number;

  /**
   *
   */
  public dataVencimento: any;

  /**
   *
   */
  constructor() {
    super()
  }
}
