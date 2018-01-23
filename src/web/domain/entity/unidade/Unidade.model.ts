import {Endereco} from '../endereco/Endereco.model';
import {Abstract} from '../abstract/Abstract.model';

export class Unidade extends Abstract {

  public nome: string;

  public endereco: Endereco;
}