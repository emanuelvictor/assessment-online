import {Unidade} from '../unidade/Unidade.model';
import {Endereco} from '../endereco/Endereco.model';
import {Abstract} from '../abstract/Abstract.model';
import {Rankeavel} from '../abstract/Rankeavel.model';

export class Usuario extends Rankeavel {

  public urlFile: string;

  public arquivoFile: any;

  public nome: string;

  public isAdministrador: boolean;

  public email: string;

  public password: string;

  public unidade: Unidade;

  public endereco: Endereco;

}
