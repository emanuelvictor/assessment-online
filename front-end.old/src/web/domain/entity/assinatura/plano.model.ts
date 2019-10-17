import {Abstract} from "../abstract/abstract.model";
import {Endereco} from "../endereco/endereco.model";
import {Dispositivo} from "../avaliacao/dispositivo.model";

export class Plano extends Abstract {

  /**
   *
   */
  public nome: string;

  /**
   *
   */
  public descricao: string;

  /**
   *
   */
  public quantidadeAvaliacoes: number;

  /**
   *
   */
  public valorAvaliacoesExcedentes: number;

  /**
   *
   */
  public valorMensal: number;

  /**
   *
   */
  public quantidadeDispositivos: number;

  /**
   *
   */
  constructor() {
    super()
  }
}
