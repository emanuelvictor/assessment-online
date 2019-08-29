import {Abstract} from '../abstract/abstract.model';
import {Unidade} from "../unidade/unidade.model";
import {TipoAvaliacao} from "./tipo-avaliacao.model";
import {UnidadeTipoAvaliacaoLicenca} from "./unidade-tipo-avaliacao-licenca.model";

export class UnidadeTipoAvaliacao extends Abstract {

  public ordem: number;

  public tipoAvaliacao: TipoAvaliacao;

  public unidade: Unidade;

  public ativo: boolean;

  public unidadesTiposAvaliacoesLicenca: UnidadeTipoAvaliacaoLicenca[];

}
