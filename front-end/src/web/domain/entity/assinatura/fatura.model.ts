import {Abstract} from "../abstract/abstract.model";
import {Endereco} from "../endereco/endereco.model";
import {Dispositivo} from "../avaliacao/dispositivo.model";
import {Plano} from "./plano.model";
import {Cidade} from "../endereco/cidade.model";
import {Assinatura} from "./assinatura.model";
import {Cupom} from "./cupom.model";

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
