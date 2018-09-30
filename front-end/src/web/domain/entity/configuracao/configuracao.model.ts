import {Abstract} from "../abstract/abstract.model";

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
    this.um = 'Péssimo';
    this.dois = 'Ruim';
    this.tres = 'Regular';
    this.quatro = 'Bom';
    this.cinco = 'Ótimo';
  }
}