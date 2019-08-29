import {Abstract} from '../abstract/abstract.model';
import {UnidadeTipoAvaliacao} from "./unidade-tipo-avaliacao.model";
import {Licenca} from "./licenca.model";

export class UnidadeTipoAvaliacaoLicenca extends Abstract {

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
  public licenca: Licenca;

  /**
   *
   */
  public unidadesTiposAvaliacoesLicenca: UnidadeTipoAvaliacaoLicenca[];

  /**
   *
   * @param ativo
   */
  constructor(ativo?: boolean) {
    super();
    this.ativo = ativo;
  }
}
