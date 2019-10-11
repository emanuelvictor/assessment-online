import {Endereco} from '../endereco/endereco.model';
import {Pessoa} from '../abstract/pessoa.model';
import {Conta} from './conta.model';
import {Unidade} from '../unidade/unidade.model';

export class Usuario extends Pessoa {

  public avatarPath: string;

  public fotoPath: string;

  public thumbnailPath: string;

  public arquivoFile: any;

  public isAdministrador: boolean;

  public conta: Conta;
  /**
   * Utilizado para paliativo em consulta de atendentes
   */
  public unidades: Unidade[];

  public endereco: Endereco;

  public siteKey: string;

  public recap: string;

}
