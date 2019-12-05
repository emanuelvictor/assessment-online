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
  public codigo: number;

  /**
   *
   */
  public senha: number;

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
  private _timeInMiliseconds: number;

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
    this.id = id;
    this.time = 30;
    this._timeInMiliseconds = this.time * 1000
  }

  /**
   *
   */
  get timeInMilis(): number {
    return this.time * 1000;
  }
}
