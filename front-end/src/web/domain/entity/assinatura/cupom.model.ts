import {Abstract} from "../abstract/abstract.model";
import {Endereco} from "../endereco/endereco.model";
import {Dispositivo} from "../avaliacao/dispositivo.model";
import {Plano} from "./plano.model";
import {Cidade} from "../endereco/cidade.model";

export class Cupom extends Abstract {

  /**
   *
   */
  private percentualDesconto: any;

  /**
   *
   */
  constructor() {
    super()
  }
}
