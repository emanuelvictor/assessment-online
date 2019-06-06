import {Abstract} from "../abstract/abstract.model";

export class Configuracao extends Abstract {
  /**
   * --------------------------------------------------------------
   *            Configurações de nomes das avaliações
   * --------------------------------------------------------------
   */

  /**
   *
   */
  public logoFile: any;

  /**
   *
   */
  public logoPath;

  /**
   *
   */
  public backgroundImageFile: any;

  /**
   *
   */
  public backgroundImagePath;

  /**
   *
   */
  public agradecimento;

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
  public feedback: boolean;

  /**
   *
   * @type {string}
   */
  public feedbackEnunciado: string;

  /**
   *
   */
  public quebrarLinhaNaSelecaoDeItenAvaliavel: boolean;

  /**
   *
   */
  public time: number;

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
    this.quebrarLinhaNaSelecaoDeItenAvaliavel = false;
    this.time = 300;
  }
}
