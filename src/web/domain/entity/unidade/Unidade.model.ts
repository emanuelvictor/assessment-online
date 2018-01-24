import {Endereco} from '../endereco/Endereco.model';
import {Abstract} from '../abstract/Abstract.model';
import {Cidade} from '../endereco/Cidade.model';

export class Unidade extends Abstract {


  constructor() {
    super();
    this.endereco = new Endereco('', '', '', '', '', new Cidade(), 0, 0);
  }

  public nome: string;

  public endereco: Endereco;
}