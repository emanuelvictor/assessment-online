import {Abstract} from "../abstract/abstract.model";
import {TipoFeedback} from "./tipo-feedback.enum";

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
   * @type {string}
   */
  public feedbackEnunciado: string;

  /**
   *
   */
  public feedback: boolean;

  /**
   *
   */
  public feedbackObrigatorio: boolean;

  /**
   *
   */
  public tipoFeedback: TipoFeedback = TipoFeedback.TEXTO;

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
    this.time = 30000;
    this.tipoFeedback = TipoFeedback.TEXTO
  }
}
