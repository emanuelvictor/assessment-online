import {Abstract} from '../abstract/abstract.model';
import {UnidadeTipoAvaliacaoDispositivo} from "./unidade-tipo-avaliacao-dispositivo.model";

export class Dispositivo extends Abstract {

  /**
   *
   */
  public numeroSerie: string;

  /**
   *
   */
  public numeroLicenca: number;

  /**
   *
   */
  public senha: string;

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
  public emUso: boolean;

  /**
   *
   */
  public quebrarLinhaNaSelecaoDeItemAvaliavel: boolean;

  /**
   *
   */
  public unidadesTiposAvaliacoesDispositivo: UnidadeTipoAvaliacaoDispositivo[] = [];


  constructor(id?: number) {
    super();
    this.interna = true;
    this.id = id
  }
}
