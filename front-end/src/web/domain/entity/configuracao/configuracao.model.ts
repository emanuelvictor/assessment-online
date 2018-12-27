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
   */
  constructor() {
    super();
  }
}