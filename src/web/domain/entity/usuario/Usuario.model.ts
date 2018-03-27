import {Unidade} from '../unidade/Unidade.model';
import {Endereco} from '../endereco/Endereco.model';
import {Abstract} from '../abstract/Abstract.model';

export class Usuario extends Abstract {

  public urlFile: string;

  public arquivoFile: any;

  public nome: string;

  public isAdministrador: boolean;

  public email: string;

  public password: string;

  public unidade: Unidade;

  public endereco: Endereco;

  public avaliacoes1: number = 0;

  public avaliacoes2: number = 0;

  public avaliacoes3: number = 0;

  public avaliacoes4: number = 0;

  public avaliacoes5: number = 0;

  /**
   *
   * @returns {number}
   */
  get media(): number {

    const soma = this.avaliacoes1 + this.avaliacoes2 + this.avaliacoes3 + this.avaliacoes4 + this.avaliacoes5;

    const avaliacoes2 = this.avaliacoes2 * 2;

    const avaliacoes3 = this.avaliacoes3 * 3;

    const avaliacoes4 = this.avaliacoes4 * 4;

    const avaliacoes5 = this.avaliacoes5 * 5;

    const somaMedia = this.avaliacoes1 + avaliacoes2 + avaliacoes3 + avaliacoes4 + avaliacoes5;

    return somaMedia / soma;
  }
}