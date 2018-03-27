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

  public avaliacoes1: number;

  public avaliacoes2: number;

  public avaliacoes3: number;

  public avaliacoes4: number;

  public avaliacoes5: number;

  /**
   *
   * @returns {number}
   */
  get avaliacaoGeral(): number {

    const avaliacaoGeral: number = 0;

    return avaliacaoGeral;
  }
}