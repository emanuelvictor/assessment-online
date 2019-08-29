import {Abstract} from '../abstract/abstract.model';
import {UnidadeTipoAvaliacaoLicenca} from "./unidade-tipo-avaliacao-licenca.model";

export class Licenca extends Abstract {

  /**
   *
   */
  public interna: boolean;

  /**
   *
   */
  public nome: string;

  /**
   *
   */
  public modoQuiosque: boolean;

  /**
   *
   */
  public modoInsonia: boolean;

  /**
   *
   */
  public latitude: boolean;

  /**
   *
   */
  public longitude: boolean;

  /**
   *
   */
  public time = 30;

  /**
   *
   */
  public quebrarLinhaNaSelecaoDeItemAvaliavel: boolean;

  /**
   *
   */
  public unidadesTiposAvaliacoesLicenca: UnidadeTipoAvaliacaoLicenca[] = [];


  constructor(id?: number) {
    super();
    this.interna = true;
    this.id = id
  }
}
