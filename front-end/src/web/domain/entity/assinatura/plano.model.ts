import {Abstract} from "../abstract/abstract.model";
import {Endereco} from "../endereco/endereco.model";
import {Licenca} from "../avaliacao/licenca.model";

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
  public quantidadeLicencas: number;

  /**
   *
   */
  constructor() {
    super()
  }
}
