import {Pessoa} from "../../abstract/pessoa.model";
import {Usuario} from "../usuario.model";
import {UnidadeTipoAvaliacao} from "../../avaliacao/unidade-tipo-avaliacao.model";

export class Avaliavel extends Pessoa {

  public usuario: Usuario;

  public unidadeTipoAvaliacao: UnidadeTipoAvaliacao;

}
