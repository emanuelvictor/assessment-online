import {Endereco} from "../endereco/endereco.model";
import {Cidade} from "../endereco/cidade.model";
import {PontoColeta} from "../ponto-coleta/ponto-coleta.model";

export class Usuario {

  public id: number;

  public nome: string;

  public email: string;

  public password: string;

  public perfil: string;

  public documento: string;

  public souEmpresa: boolean;

  public nomeResponsavel: string;

  public contatoTelefonico: string;

  public lastLogin: Date;

  public endereco: Endereco = new Endereco(null, null, null, null, null, new Cidade(), null, null);

  public areasAtuacao: any[] = [];

  public pontoColeta: PontoColeta = null;

  constructor() {
    this.endereco = new Endereco(null, null, null, null, null, new Cidade(), null, null);
  }
}