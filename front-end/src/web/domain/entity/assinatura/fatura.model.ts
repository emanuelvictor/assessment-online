import {Abstract} from '../abstract/abstract.model';
import {Assinatura} from './assinatura.model';
import {Cupom} from './cupom.model';

export class Fatura extends Abstract {

  /**
   *
   */
  private linkBoleto: string;

  /**
   *
   */
  private dataInicio: any;

  /**
   *
   */
  private dataTermino: any;

  /**
   *
   */
  private dataPagamento: any;

  /**
   *
   */
  private assinatura: Assinatura;

  /**
   *
   */
  private cupom: Cupom;

  /**
   *
   */
  constructor() {
    super()
  }
}
