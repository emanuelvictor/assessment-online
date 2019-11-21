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
  public ativo: boolean;

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
  public latitude: boolean;

  /**
   *
   */
  public longitude: boolean;

  /**
   *
   */
  public time = 30;

  public dataDesativacao: any;

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
