import {Unidade} from '../unidade/Unidade.model';
import {Endereco} from '../endereco/Endereco.model';
import {Abstract} from '../abstract/Abstract.model';

export class Usuario extends Abstract {

  public urlFile: string;

  public arquivoFile: any;

  public nome: string;

  public isAdministrador: boolean;

  public uid: string;

  public login: string;

  public password: string;

  public unidade: Unidade;

  public endereco: Endereco;

}