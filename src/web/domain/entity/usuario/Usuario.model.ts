import {Unidade} from '../unidade/Unidade.model';
import {Endereco} from '../endereco/Endereco.model';
import {Abstract} from '../abstract/Abstract.model';

export class Usuario extends Abstract {

  public foto: File;

  public nome: string;

  public isAdministrador: boolean;

  public email: string;

  public password: string;

  public unidade: Unidade;

  public endereco: Endereco;

}