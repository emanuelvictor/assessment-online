import {Endereco} from '../endereco/Endereco.model';
import {Rankeavel} from '../abstract/Rankeavel.model';

export class Usuario extends Rankeavel {

  public urlAvatarFoto: string;

  public urlFoto: string;

  public arquivoFile: any;

  public isAdministrador: boolean;

  public email: string;

  public password: string;

  /**
   * Utilizado para paliativo em consulta de atendentes
   */
  public unidades: string;

  public endereco: Endereco;

}
