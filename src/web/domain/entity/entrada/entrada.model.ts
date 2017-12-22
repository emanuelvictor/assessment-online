import {PontoColeta} from "../ponto-coleta/ponto-coleta.model";
import {Ficha} from "../fornecedor/ficha.model";

export class Entrada {

  public id: number;

  public ficha: Ficha;

  public pontoColeta: PontoColeta;

  public created: Date;

  public peso: number;

  public nivelContaminacao: number;

  public observacao: string;

  constructor() {
  }
}