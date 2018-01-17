import {Unidade} from "../unidade/unidade.model";
import {Endereco} from "../endereco/endereco.model";

export class Atendente {

  public key: string;

  public nome: string;

  public email: string;

  public unidade: Unidade;

  public endereco: Endereco;
}