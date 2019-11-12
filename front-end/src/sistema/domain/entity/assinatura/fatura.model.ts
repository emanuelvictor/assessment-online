import {Abstract} from '../abstract/abstract.model';
import {Assinatura} from './assinatura.model';
import {Cupom} from './cupom.model';

export class Fatura extends Abstract {

  /**
   *
   */
  public cancelada: boolean;

  /**
   *
   */
  public linkBoleto: string;

  /**
   *
   */
  public created: any;

  /**
   *
   */
  public dataVencimento: any;

  /**
   *
   */
  public dataPagamento: any;

  /**
   *
   */
  public assinatura: Assinatura;

  /**
   *
   */
  public cupom: Cupom;

  /**
   *
   */
  constructor() {
    super()
  }
}
