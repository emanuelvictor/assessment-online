import {Abstract} from '../abstract/abstract.model';
import {UnidadeTipoAvaliacaoDispositivo} from "./unidade-tipo-avaliacao-dispositivo.model";

export class Dispositivo extends Abstract {

  /**
   *
   */
  public publico: boolean;

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
  public time: number;

  /**
   *
   */
  public quebrarLinhaNaSelecaoDeItenAvaliavel: boolean;

  /**
   *
   */
  public unidadesTiposAvaliacoesDispositivo: UnidadeTipoAvaliacaoDispositivo[] = [];


  constructor(id?: number) {
    super();
    this.id = id
  }
}
