import {Endereco} from '../endereco/Endereco.model';
import {Cidade} from '../endereco/Cidade.model';
import {Rankeavel} from '../abstract/Rankeavel.model';
import {Abstract} from "../abstract/Abstract.model";

export class Configuracao extends Abstract {
  /**
   * --------------------------------------------------------------
   *            Configurações de nomes das avaliações
   * --------------------------------------------------------------
   */

  /**
   *
   * @type {string}
   */
  public um = 'Terrível';

  /**
   *
   * @type {string}
   */
  public dois = 'Ruim';

  /**
   *
   * @type {string}
   */
  public tres = 'Meia boca';

  /**
   *
   * @type {string}
   */
  public quatro = 'Bacana';

  /**
   *
   * @type {string}
   */
  public cinco = 'Top da balada';

  /**
   *
   */
  constructor() {
    super();
    this.um = 'Terrível';
    this.dois = 'Ruim';
    this.tres = 'Meia boca';
    this.quatro = 'Bacana';
    this.cinco = 'Top da balada';
  }
}
