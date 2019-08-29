import {Pessoa} from "../../abstract/pessoa.model";
import {Usuario} from "../usuario.model";
import {UnidadeTipoAvaliacaoLicenca} from "../../avaliacao/unidade-tipo-avaliacao-licenca.model";

export class Avaliavel extends Pessoa {

  public usuario: Usuario;

  public unidadeTipoAvaliacaoLicenca: UnidadeTipoAvaliacaoLicenca;

  public ativo: boolean;

}
