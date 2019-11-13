import {Abstract} from '../abstract/abstract.model';
import {UnidadeTipoAvaliacaoDispositivo} from './unidade-tipo-avaliacao-dispositivo.model';
import {Unidade} from '../unidade/unidade.model';

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
  public codigo: number;

  /**
   *
   */
  public senha: string;

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

  /**
   *
   */
  public unidades: Unidade[] = [];

  /**
   *
   * @param id
   */
  constructor(id?: number) {
    super();
    this.id = id
  }
}
