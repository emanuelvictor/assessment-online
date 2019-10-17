import {Pessoa} from "../../abstract/pessoa.model";
import {Usuario} from "../usuario.model";
import {UnidadeTipoAvaliacaoDispositivo} from "../../avaliacao/unidade-tipo-avaliacao-dispositivo.model";

export class Avaliavel extends Pessoa {

  public usuario: Usuario;

  public unidadeTipoAvaliacaoDispositivo: UnidadeTipoAvaliacaoDispositivo;

  public ativo: boolean;

}
