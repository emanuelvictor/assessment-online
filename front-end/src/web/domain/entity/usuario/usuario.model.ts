import {Endereco} from '../endereco/Endereco.model';
import {Rankeavel} from '../abstract/Rankeavel.model';
import {Conta} from './conta.model';

export class Usuario extends Rankeavel {

  public avatarPath: string;

  public fotoPath: string;

  public thumbnailPath: string;

  public arquivoFile: any;

  public isAdministrador: boolean;

  public conta: Conta;
  /**
   * Utilizado para paliativo em consulta de atendentes
   */
  public unidades: string;

  public endereco: Endereco;

}
