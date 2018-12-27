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