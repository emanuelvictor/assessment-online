import {Abstract} from '../abstract/abstract.model';
import {UnidadeTipoAvaliacao} from './unidade-tipo-avaliacao.model';
import {Dispositivo} from './dispositivo.model';

export class UnidadeTipoAvaliacaoDispositivo extends Abstract {

  /**
   *
   */
  public ativo: boolean = true;

  /**
   *
   */
  public ordem: number;

  /**
   *
   */
  public unidadeTipoAvaliacao: UnidadeTipoAvaliacao;

  /**
   *
   */
  public dispositivo: Dispositivo;

  /**
   *
   */
  public unidadesTiposAvaliacoesDispositivo: UnidadeTipoAvaliacaoDispositivo[];

  /**
   *
   * @param ativo
   */
  constructor(ativo?: boolean) {
    super();
    this.ativo = ativo;
  }
}
